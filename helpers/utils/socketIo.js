import http from 'http';
import socketIo from 'socket.io';
import models from '../../models';
import userHelper from '../userHelper';
import gameHelper from '../game';

const { Message, User } = models;

/**
 * @exports SocketIO
 * @param {object} app
 * @returns {object} SocketIo
 * @description Implemetation on socket
 */
const SocketIO = (app) => {
	http.createServer(app);
	const port = process.env.PORT || 3000;
	const io = socketIo.listen(
		app.listen(port, () => {
			console.log(`Listening on port ${port}`);
		})
	);
	io.use((socket, next) => {
		next(null, next);
	});
	io.on('connection', (socket) => {
		socket.on('create', (name) => socket.join(name));
		socket.on('auto_submit', (roomName) => {
			io.sockets.in(roomName).emit('submit', { isSubmited: true, user: 'test' });
			console.log('====>Auto Submit called');
		});
		socket.on('new_message', async (data) => {
			const userId = await userHelper.findUserByToken(data.token);
			const user = await User.findOne({ where: { id: userId } });
			const { username } = user.dataValues;
			const saveMessage = await Message.create({
				senderId: userId,
				message: data.message
			});
			if (!saveMessage) socket.emit('message_failed', { error: 'Last message was not sent' });
			socket.emit('message_created', { message: data.message, username });
		});
		socket.on('joined', async (info) => {
			await gameHelper.updateJoinedUser(info);
			const userInRoom = await gameHelper.findRoomInfo(info.roomId);
			const invited = userInRoom.emails.length;
			const joined = userInRoom.joined.length;
			if (invited === joined) {
				socket.emit('Alljoined');
			}
		});
		socket.on('disconnect', () => {});
	});
};

export default SocketIO;
