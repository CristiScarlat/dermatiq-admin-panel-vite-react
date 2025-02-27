import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import {SyntheticEvent, useContext} from "react";
import {Ctx} from "../context/context.tsx";


const AdminLogin = () => {

    const navigate = useNavigate();

    const context = useContext(Ctx);
    console.log(context)

    //const apiUrl: string = import.meta.env.MODE === "development" ? "http://localhost:3000/api" : import.meta.env.VITE_API_URL

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try{
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                credentials: "include",
                body: JSON.stringify({
                    username: formData.get('username'),
                    password: formData.get('password')
                }),
                headers: {
                    Accept: 'application/json',
                }
            })
            const userData = await res.json();

            console.log(userData);

            if(userData && context){
                context.dispatch({type: "SET_AUTH", payload: {user: userData}})
            }

            if(res.status === 200){
                navigate('/');
            }
        }
        catch(error) {
            console.log(error)
        }
    }

    return(
        <div>
            <Form className="mx-auto my-5" style={{maxWidth:"50rem"}} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" name="username"/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password"/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}


export default AdminLogin