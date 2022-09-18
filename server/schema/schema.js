const graphql = require("graphql");
const axios = require("axios");

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull,
} = graphql;

const companyType = new GraphQLObjectType({
	name: "Company",
	fields: () => ({
		id: { type: GraphQLInt },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		users: {
			type: new GraphQLList(userType),
			resolve(parentValue, args) {
				return axios
					.get(
						`http://localhost:3000/company/${parentValue.id}/users`,
					)
					.then((res) => res.data);
			},
		},
	}),
});

const userType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: GraphQLInt },
		first_name: { type: GraphQLString },
		gender: { type: GraphQLString },
		company: {
			type: companyType,
			resolve(parentValue, args) {
				return axios
					.get(
						`http://localhost:3000/company/${parentValue.companyID}`,
					)
					.then((res) => res.data);
			},
		},
	}),
});

const mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addUser: {
			type: userType,
			args: {
				first_name: { type: new GraphQLNonNull(GraphQLString) },
				gender: { type: new GraphQLNonNull(GraphQLString) },
				companyID: { type: GraphQLInt },
			},
			resolve(parentValue, { first_name, gender }) {
				return axios
					.post("http://localhost:3000/users", { first_name, gender })
					.then((res) => res.data);
			},
		},
		editUser: {
			type: userType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLInt) },
				first_name: { type: GraphQLString },
				gender: { type: GraphQLString },
				companyID: { type: GraphQLString },
			},
			resolve(parentValue, args) {
				return axios
					.patch(`http://localhost:3000/users/${args.id}`, args)
					.then((res) => res.data);
			},
		},
		deleteUser: {
			type: userType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve(parentValue, { id }) {
				return axios
					.delete(`http://localhost:3000/users/${id}`)
					.then((res) => res.data);
			},
		},
	},
});

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		user: {
			type: userType,
			args: { id: { type: GraphQLString } },

			resolve(parentValue, args) {
				return axios
					.get(`http://localhost:3000/users/${args.id}`)
					.then((res) => res.data);
			},
		},
		company: {
			type: companyType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return axios
					.get(`http://localhost:3000/companies/${args.id}`)
					.then((res) => res.data);
			},
		},
	},
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation });
