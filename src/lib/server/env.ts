import { env } from '$env/dynamic/private';

export const config = {
	nodeEnv: env.NODE_ENV || 'development'
};
