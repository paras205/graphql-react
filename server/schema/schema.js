const graphql = require("graphql");

const { GraphQLObjectType, GraphQLString, GraphQLInt } = graphql;

const userType = new GraphQLObjectType({
	name: "User",
	fields: {
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt },
	},
});
