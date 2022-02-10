const { AuthenticationError } = require("apollo-server-express");
const { saveBook } = require("../controllers/user-controller");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("bookCount")
          .populate("saveBook");

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    saveBook: async (parent, { saveBookInput }, context) => {
      if (context.user) {
        const updatedUser = await user.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { saveBook: { saveBookInput } } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
    // remove a book from `savedBooks`
    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await user.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { saveBook: { bookId: bookId } } },
          { new: true, runValidators: true }
        );

        if (!updatedUser) {
          return res
            .status(404)
            .json({ message: "Couldn't find user with this id!" });
        }
        return res.json(updatedUser);
      }
    },
  },
};

module.exports = resolvers;
