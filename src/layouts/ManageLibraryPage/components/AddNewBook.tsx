import { useOktaAuth } from "@okta/okta-react";
import React, { useState } from "react";
import Constants from '../../../utils/Constants.json';
import AddBookRequest from "../../../models/AddBookRequest";

export const AddNewBook = () => {

    const { authState } = useOktaAuth();

    // add book
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("Category")
    const [copies, setCopies] = useState(0)
    const [img, setImg] = useState<any>(null)

    // diaplays

    const [displayWarning, setDisplayWarning] = useState(false)
    const [displaySuccess, setDisplaySuccess] = useState(false)


    const handleCategory = (category: string) => {
        setCategory(category)
    }
    const handleTitle = (e: any) => {
        setTitle(e.target.value)
    }
    const handleAuthor = (e: any) => {
        setAuthor(e.target.value)
    }
    const handleDescription = (e: any) => {
        setDescription(e.target.value)
    }
    const handleCopies = (e: any) => {
        setCopies(e.target.value)
    }

    const handleImg=(e:any) =>{
        if(e.target.files[0]){
            getBase64(e.target.files[0])
        }
    }

    const getBase64 = (file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImg(reader.result)
        };
        reader.onerror = (error) => {
            console.log('Error: ', error);
        };
    }


    const submitBook = async () =>{
        if(authState && authState.isAuthenticated && title !=="" && author!== "" && description !== "" && copies >0 &&
         category !== "Category" ){

            const url: string = Constants.API_URL+Constants.Admin + Constants.Secure + Constants.AddBook
            const addBookRequest = new AddBookRequest(title, author, description, copies,category)
            addBookRequest.img=img;
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authState?.accessToken?.accessToken}`
                },
                body: JSON.stringify(addBookRequest)
            }
            const response = await fetch(url, requestOptions)

            if(!response.ok){
                throw new Error("Something went wrong");
            }
            // const responseJson = await response.json()
            // console.log("responseJson=", responseJson)
            setTitle('')
            setAuthor('')
            setDescription('')
            setCopies(0)
            setCategory("Category")
            setImg(null)
            setDisplayWarning(false)
            setDisplaySuccess(true)
            
         }
         else {
            setDisplayWarning(true)
            setDisplaySuccess(false)
         }
    }
    return (
        <div className="containenr mt-5 mb-5">
            {displaySuccess &&
                <div className="alert alert-success" role="alert">
                    Book added successfully.
                </div>
            }
            {displayWarning &&
                <div className="alert alert-danger" role="alert">
                    All fields must be filed out.
                </div>
            }

            <div className="card">
                <div className="card-header">Add a new Book</div>
                <div className="card-body">
                    <form method="POST">
                        <div className="row mb-3">
                            <div className="col-md-6 ">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="addTitle"
                                    value={title}
                                    onChange={handleTitle}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Author</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="addAuthor"
                                    value={author}
                                    onChange={handleAuthor}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Category</label>
                                <button
                                    type="button"
                                    className="form-control btn btn-secondary dropdown-toggle"
                                    id="addCategory"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                > {category} </button>

                                <ul id="addCategoryList" className="dropdown-menu" aria-labelledby="addCategory">
                                    <li><a className="dropdown-item" onClick={() => handleCategory("FE")} >Front End</a></li>
                                    <li><a className="dropdown-item" onClick={() => handleCategory("BE")} >Back End</a></li>
                                    <li><a className="dropdown-item" onClick={() => handleCategory("Data")} >Data</a></li>
                                    <li><a className="dropdown-item" onClick={() => handleCategory("DevOps")} >DevOps</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="row mb-3">

                            <div className="col-md-12">
                                <label className="form-label">Description</label>
                                <textarea
                                    id="addDescription"
                                    className="form-control"
                                    rows={3}
                                    onChange={handleDescription}
                                    value={description} />
                            </div>
                        </div>
                        <div className="row mb-3">

                            <div className="col-md-3 ">
                                <label className="form-label">Copies</label>
                                <input type="number"
                                    id="addcopies"
                                    className="form-control"
                                    value={copies}
                                    onChange={handleCopies}
                                    name="copies" />
                            </div>
                            <div className="col-md-3 ">
                                <label className="form-label">Img</label>
                                <input className="form-control" type="file" onChange={handleImg} />
                            </div>
                        </div>
                        <div>
                            <button type="button" className="btn btn-primary mt-3" onClick={submitBook}>Add book</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}