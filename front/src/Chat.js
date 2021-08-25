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
			socketRef.current.on("game", ({ number,name }) => {
				setGame([ ...game, { number,name } ])
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

	const onClickbtn = () => {
		const { name, message } = state
		let number =document.getElementById('gameNumber').value;
		console.log(number);
		socketRef.current.emit('game',{number,name});
		
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
		
		console.log(game);
		return game.map(({number,name}, index) => (
			<div key={index}>
				<h3>
				{name}:<span>{number}</span>
				</h3>
			</div>
		))
	}
	return (
		<>
		<div className="card">
			<form onSubmit={onMessageSubmit}>
				<h1>Messenger</h1>
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
				<button>Send Message</button>
			</form>
			<div className="render-chat">
				<h1>Chat Log</h1>
				{renderChat()}
			</div>
		</div>
		<div className="card">
			<h2>
				Guess Game
			</h2><br/>
			<p>
				guess the number
			</p><br/>
			<div className="name-field">
			<TextField name="name" label="enter a number" id='gameNumber' type='number' />
			</div><br/>
			<button onClick={onClickbtn}>submit</button><br/>
			<div className="render-chat">
				<h1>Number of trying</h1>
				{renderGame()}
			</div>
		</div>
		</>
	)
}

export default App

