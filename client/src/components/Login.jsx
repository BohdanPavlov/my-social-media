import React, { useEffect } from 'react';
import jwtDecode from 'jwt-decode';

import { useNavigate } from 'react-router-dom';

import mainVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { client } from '../client';

const Login = () => {
	const navigate = useNavigate();

	function handleCallbackResponse(response) {
		const userObj = jwtDecode(response.credential);
		localStorage.setItem('user', JSON.stringify(userObj));

		const { name, sub, picture } = userObj;

		const doc = {
			_id: sub,
			_type: 'user',
			userName: name,
			image: picture,
		};

		client.createIfNotExists(doc).then(() => {
			navigate('/', { replace: true });
		});
	}

	useEffect(() => {
		/* global google*/
		google.accounts.id.initialize({
			client_id: process.env.REACT_APP_GOOGLE_API_TOKEN,
			callback: handleCallbackResponse,
		});

		google.accounts.id.renderButton(document.getElementById('signInDiv'), {
			theme: 'outline',
			size: 'large',
		});
	}, []);

	return (
		<div className='flex justify-start items-center flex-col h-screen'>
			<div className='relative w-full h-full'>
				<video
					src={mainVideo}
					loop
					controls={false}
					muted
					autoPlay
					className='w-full h-full object-cover'
				/>
				<div
					className='absolute flex flex-col justify-center items-center
				top-0 right-0 left-0 bottom-0 bg-blackOverlay'
				>
					<div className='p-5'>
						<img src={logo} width='130px' alt='logo' />
					</div>
					<div id='signInDiv'></div>
				</div>
			</div>
		</div>
	);
};

export default Login;
