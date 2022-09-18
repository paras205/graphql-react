const graphql = require("graphql");
const axios = require("axios");

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

const userType = new GraphQLObjectType({
	name: "User",
	fields: {
		id: { type: GraphQLInt },
		first_name: { type: GraphQLString },
		gender: { type: GraphQLString },
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
	},
});

module.exports = new GraphQLSchema({ query: RootQuery });
