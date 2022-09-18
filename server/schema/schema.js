const graphql = require("graphql");

const { GraphQLObjectType } = graphql;

const userType = new GraphQLObjectType({
	name: "User",
	fields: {
		id: { type: graphql.GraphQLString },
		firstName: { type: graphql.GraphQLString },
		age: { type: graphql.GraphQLInt },
	},
});
