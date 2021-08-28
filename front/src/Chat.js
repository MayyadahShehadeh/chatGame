import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import "./App.css"

function App() {

	const [ state, setState ] = useState({ message: "", name: "" })
	const [ chat, setChat ] = useState([]);
	const [ game, setGame] = useState([]);

	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:4000")
			socketRef.current.on("message", ({ name, message }) => {
				setChat([ ...chat, { name, message } ])
			})
			socketRef.current.on("game", ({ number,name,username }) => {
				setGame([ ...game, { number,name,username } ])
			})
			return () => socketRef.current.disconnect()
		},
		[ chat ],
		[game]
	)

	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		const { name, message } = state
		socketRef.current.emit("message", { name, message })
		e.preventDefault()
		setState({ message: "", name })
		
	}

	const onClickbtn = (e) => {
		const { name,username } = state
		let number =document.getElementById('gameNumber').value;
		console.log(number);
		socketRef.current.emit('game',{number,name,username});
		e.preventDefault()
		
	}

	const renderChat = () => {
		
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3>
					{name}: <span>{message}</span>
				</h3>
			</div>
		))
	}

	const renderGame = () => {
		return game.map(({number,name,username}, index) => (
			<div key={index}>
				<h3>
				the number {number} : <span>{username}</span>
				</h3>
				{username==='is correct'?<h3>{name} the winner is </h3>:<h3></h3>}
			</div>
		))
	}
	return (
		<>
		<div className="card chat-card">
			<form onSubmit={onMessageSubmit}>
				<h1>User Information</h1>
				<div className="name-field">
					<TextField name="name" onChange={(e) => onTextChange(e)} value={state.name} label="Name" />
				</div>
				<div>
					<TextField
						name="message"
						onChange={(e) => onTextChange(e)}
						value={state.message}
						id="outlined-multiline-static"
						variant="outlined"
						label="Message"
					/>
				</div>
				<button className="message-btn">Send Message</button>
			</form>
			<div className="render-chat">
				<h1>Chats</h1>
				{renderChat()}
			</div>
		</div>
		{}
		<div className="card game-card">
			<h2>
				Guess Game
			</h2><br/>
			<p>
				guess the number between 1 to 5
			</p><br/>
			<div className="number-field">
			<TextField name="name" label="enter a number" id='gameNumber' type='number' />
			</div><br/>
			<div className="game-btn">
			<button onClick={onClickbtn}>submit</button><br/>
			</div>
				<h1>Result</h1>
			<div className="render-game">
				<div className="output">
				{renderGame()}
				</div>
			</div>
		</div>
		</>
	)
}

export default App

