import mongoose from "mongoose";

const connectDb = async () => {
  try {
    //try ke andr hmm database connect krege
    await mongoose.connect(
      "mongodb+srv://rishisharma5600:KD07@cluster0.fqn1wtr.mongodb.net/virtualAssistant"
    );
    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
};
export default connectDb;
