import client from '../client';
import bcrypt from 'bcrypt';

const resolvers = {
	Query: {
		seeProfile: (_, { username }) =>
			client.user.findUnique({
				where: {
					username,
				},
			}),
	},
	Mutation: {
		createAccount: async (
			_,
			{ username, email, name, location, avatarURL, githubUsername, password },
		) => {
			try {
				const existingUser = await client.user.findFirst({
					where: {
						OR: [
							{
								username,
							},
							{
								email,
							},
						],
					},
				});

				if (existingUser) {
					return { ok: false, error: 'Username or Email is already taken.' };
				}

				const hashedPassword = await bcrypt.hash(password, 10);
				const user = await client.user.create({
					data: {
						username,
						email,
						name,
						location,
						avatarURL,
						githubUsername,
						password: hashedPassword,
					},
				});

				return {
					ok: true,
					id: user.id,
				};
			} catch (error) {
				return { ok: $error };
			}
		},
	},
};
export default resolvers;
