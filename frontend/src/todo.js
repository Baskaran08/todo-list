import {useEffect, useState} from 'react'

export default function Todo(){
    const [title,setTitle]=useState("")
    const [description,setDescription]=useState("")
    const [todos,setTodos]=useState([])
    const [message,setMessage]=useState("")
    const [editId,setEditId]=useState(-1)
    const [EditTitle,setEditTitle]=useState("")
    const [EditDescription,setEditDescription]=useState("")
    const [error,setError]=useState("")
    const apiurl='http://localhost:8000'

    useEffect(()=>{
        fetch(apiurl+'/todos')
        .then((res)=>res.json())
        .then((data)=>setTodos(data))
    },[])

    function addItem(){
        setError("")
        if(title.trim()!=='' && description.trim()!==''){
            fetch(apiurl+'/todos',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    title,description
                })
            })
            .then((res)=>{
                if(res.ok){
                    setTodos([...todos,{title,description}])
                    setMessage("Item Added Successfully!")
                    setTitle("")
                    setDescription("")
                    setTimeout(() => {
                        setMessage("")
                    }, 3000);
                }
                else{
                    setError("unable to Add Todo Item")
                }
            })
            .catch(()=>{
                setError("unable to Add Todo Item")
            })
        } 
    }

    function handleEdit(item){
        setEditId(item._id)
        setEditTitle(item.title)
        setEditDescription(item.description)
    }

    function updateItem(){
        setError("")
        if(EditTitle.trim()!=='' && EditDescription.trim()!==''){
            fetch(apiurl+'/todos/'+editId,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    title:EditTitle,
                    description:EditDescription
                })
            })
            .then((res)=>{
                if(res.ok){

                    //update
                    const updatedTodos=todos.map((item)=>{
                        if(item._id==editId){
                            item.title=EditTitle;
                            item.description=EditDescription;
                        }
                        return item;
                    })

                    setTodos(updatedTodos)
                    setMessage("Item Updated Successfully!")
                    setTimeout(() => {
                        setMessage("")
                    }, 3000);
                    setEditId(-1)
                    setEditTitle("")
                    setEditDescription("")
                }
                else{
                    setError("unable to Update Todo Item")
                }
            })
            .catch(()=>{
                setError("unable to Update Todo Item")
            })
        } 
    }

    function handleCancel(){
        setEditId(-1)
    }

    function deleteItem(id){
        if(window.confirm('Are you sure want to delete?')){
            fetch(apiurl+'/todos/'+id,{
                method:'DELETE'
            })
            .then(()=>{
                const DeletedTodo=todos.filter((item)=>item._id!==id)
                setTodos(DeletedTodo)
            })
        }
    }

    return(
        <>
        <div className="row bg-success text-light p-3">
            <h1 className="text-center">Todo App</h1>
        </div>
        <div className='row my-3'>
            <h3>Add Item</h3>
            {message && <p className='text-success'>{message}</p>}
            <div className='form-group d-flex gap-2'>
                <input className='form-control' type='text' onChange={(e)=>setTitle(e.target.value)} value={title} placeholder='Title' />
                <input className='form-control' type='text' onChange={(e)=>setDescription(e.target.value)} value={description} placeholder='Description' />
                <button className='btn btn-dark' onClick={addItem}>Submit</button>
            </div>
            {error && <p className='text-danger'>{error}</p>}
        </div>
        <div className='row mt-3'>
            <h3>Tasks</h3>
            <div className='col-md-6'>
                <ul className='list-group'>
                    {
                        todos.map((item)=>
                            <li className='list-group-item d-flex justify-content-between align-items-center bg-info my-2'>
                                <div className='d-flex flex-column'>
                                    {
                                        editId==-1 || editId!==item._id ?
                                        <> 
                                            <span className='fw-bold'>{item.title}</span>
                                            <span>{item.description}</span>
                                        </> : 
                                        <div className='form-group d-flex gap-2 me-2'>
                                            <input className='form-control' type='text' onChange={(e)=>setEditTitle(e.target.value)} value={EditTitle} placeholder='Title' /> 
                                            <input className='form-control' type='text' onChange={(e)=>setEditDescription(e.target.value)} value={EditDescription} placeholder='Description' />
                                        </div>
                                    } 
                                </div>
                                <div className='d-flex gap-2'>
                                    {editId==-1 || editId!==item._id ? <button className='btn btn-warning' onClick={()=>handleEdit(item)}>Edit</button> : <button className='btn btn-warning' onClick={updateItem}>Update</button>}
                                    {editId==-1 || editId!==item._id ? <button className='btn btn-danger' onClick={()=>deleteItem(item._id)}>Delete</button> : <button className='btn btn-danger' onClick={handleCancel}>Cancel</button>}
                                </div>
                            </li>
                        )
                    }
                    
                </ul>
            </div>
  
        </div>
           
        </>
    )
}