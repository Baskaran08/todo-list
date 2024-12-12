const express=require('express')
const app=express()
const mongoose=require('mongoose')
const cors=require('cors')

app.use(express.json())
app.use(cors())


// let todos=[]

// connecting database

mongoose.connect('mongodb://localhost:27017/Todo_List')
.then(()=>{
    console.log("database connected..")
})
.catch((err)=>{
    console.log("database not connected..")
})

//creating schema

const todoSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String
})

//creating model

const todoModel=mongoose.model('Todo',todoSchema);


//create a new todo

app.post('/todos',async (req,res)=>{
    const {title,description}=req.body;
    try{
        const newtodo=new todoModel({title,description})
        await newtodo.save();
        res.status(201).json(newtodo);
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
    
})

//get all todos

app.get('/todos',async (req,res)=>{

    try{
        const todos=await todoModel.find({});
        res.status(200).json(todos)
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})


//updata a todo item

app.put('/todos/:id',async (req,res)=>{
    try{
        const {title,description}=req.body;
        const todoId=req.params.id;
        const updatedTodo=await todoModel.findByIdAndUpdate(todoId,{title,description},{new:true})
        if(!updatedTodo){
            return res.status(404).json("Todo item Not Found!!")
        }
        res.json(updatedTodo)
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})

//delete a todo item

app.delete('/todos/:id',async (req,res)=>{
    try{
        const deleteId=req.params.id;
        await todoModel.findByIdAndDelete(deleteId);
        res.status(204).end();
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})


app.listen(8000,()=>{
    console.log("server listening to port 8000..")
})