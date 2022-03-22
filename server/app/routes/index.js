import check from './check';

export default (io) => {
	io.of('/check')
		.on('connection', check);
};