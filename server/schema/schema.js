const graphql = require("graphql");
const axios = require("axios");

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
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

module.exports = new GraphQLSchema({ query: RootQuery });
