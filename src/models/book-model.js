import mongoose from "mongoose";

const bookShema = new mongoose.Schema(
  {
    title:String,
    author:String,
    genre:String,
    publication_date:String,
  }
)
const Book = mongoose.model('Book',bookShema)

export default Book
