import { User } from '../components/auth/types';

declare global {
	interface Request {
		user?: User | null;
		session?: any | null;
	}
}

export {};
