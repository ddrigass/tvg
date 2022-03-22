import routes from './routes';

export default (io) => {

	routes(io);
	return io;
};