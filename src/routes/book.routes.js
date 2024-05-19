import express from 'express'
import Book from '../models/book-model.js'
const router = express.Router()

//MIDDLEWARE
const getBook = async(req,res,next)=>{
  let book;
  const {id} = req.params;
  if(!id.match(/^[0-9a-fA-F]{24}$/)){
    return res.status(400).json({message:'EL ID del libro no es valido'})
  }
  try {
    book =await Book.findById(id);
    if(!book){
      return res.status(404).json({
        message:'El libro no existe'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message:'Error al obtener el libro',
      error: error.message
    })
  }

  res.book = book
  next()
}

//obtener todos los libros [GET  ALL]

router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    console.log('GET ALL', books)
    if(books.length === 0){
      return res.status(204).json([])
    }
    res.json(books)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})

// crear un nuevo libro
router.post('/',async (req,res)=>{
  const {title, author, genre, publication_date} = req?.body
  if(!title || !author || !genre || !publication_date){
    return res.status(400).json({
      message: 'LOS CAMPOS titulos, autor, genero y fecha son obligatorios'
    })
  }

  const book = new Book({
    title, author, genre, publication_date
  })

  try {
    const newBook = await book.save()
    console.log(newBook)
    res.status(201).json(newBook)
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})

router.get('/:id', getBook, async(req,res)=>{
  res.json(res.book);
})

router.put('/:id', getBook, async(req,res)=>{
  try {
    const book = res.book
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;

    const uddatedBook = await book.save()
    res.json(uddatedBook)
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})

router.patch('/:id', getBook, async(req,res)=>{

  if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date ){
    return res.status(400).json({
      message: "al menos uno de estos campos debe ser enviado titulo, genero, autor o fecha"
    })
  }

  try {
    const book = res.book
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;

    const uddatedBook = await book.save()
    res.json(uddatedBook)
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})

router.delete('/:id', getBook, async(req,res)=>{
  try {
    const book = res.book
    await book.deleteOne({
      _id: book._id
    })
    res.json({
      message:  `Book deleted ${book.title}`
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})
export default router