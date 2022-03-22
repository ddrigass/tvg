export default (socket) => {
	socket.on('status', function(payload) {
		console.log(payload);
	});
};