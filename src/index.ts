import cronDelete from './helpers/cronDelete';
import { initializeTables } from './utils/database';
import { router } from './routes';
import { Env } from './types';

export default {
	async scheduled(controller: any, env: Env, ctx: any) {
		await cronDelete(env);
	},

	async fetch(request: Request, env: Env, ctx: any) {
		// Initialize database tables once at startup
		ctx.waitUntil(
			initializeTables(env).catch((error) => {
				console.error('Failed to initialize database tables:', error);
			})
		);

		// Route all requests through the router
		return router(request, env);
	},
};
