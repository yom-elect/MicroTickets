import {
    useState
} from 'react';
import Router from "next/router";
import useRequestHook from '../../hooks/use-request';

const NewTicket = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(0)
    const {
        doRequest,
        errors
    } = useRequestHook({
        url: '/api/tickets',
        method: "post",
        body: {
            title,
            price
        },
        onSuccess: (ticket) => Router.push("/")
    })

    const onSubmitHandler = (event) => {
        event.preventDefault();
        doRequest();
    }
    const onBlur = () => {
        const value = parseFloat(price);

        if (isNaN(value)) {
            return
        }
        setPrice(value.toFixed(2))
    }

    return ( <
        div >
        <
        h1 > Create a Ticket < /h1>  <
        form onSubmit = {
            onSubmitHandler
        } >
        <
        div className = "form-group" >
        <
        label > Title < /label> <
        input value = {
            title
        }
        onChange = {
            (e) => setTitle(e.target.value)
        }
        className = "form-control" / >
        <
        /div> <div className = "form-group" > <
        label > Price < /label> <
        input type = "number"
        value = {
            price
        }
        onBlur = {
            onBlur
        }
        onChange = {
            (e) => setPrice(e.target.value)
        }
        className = "form-control" / >
        <
        /div>  { errors } <
        button className = "btn btn-primary" > Submit < /button> < /
        form > <
        /
        div >
    )

};

export default NewTicket;