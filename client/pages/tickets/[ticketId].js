import Router from "next/router";
import useRequestHook from '../../hooks/use-request';


const TicketShow = ({
    ticket
}) => {
    const {
        data
    } = ticket
    const {
        doRequest,
        errors
    } = useRequestHook({
        url: '/api/orders',
        method: "post",
        body: {
            ticketId: data.id
        },
        onSuccess: (order) => Router.push("/orders/[orderid]", `/orders/${order.data.id}`)


    })

    return ( <
            div >
            <
            h1 > {
                data.title
            } < /h1> <
            h4 > $ {
                data.price
            } < /h4> {
            errors
        } <
        button onClick = {
            (e) =>
            doRequest()
        }
    className = "btn btn-primary" > Purchase < /button> < /
    div > )
}

TicketShow.getInitialProps = async(context, client) => {
    const {
        ticketId
    } = context.query;
    const {
        data
    } = await client.get(`/api/tickets/${ticketId}`)
    return {
        ticket: data
    }
}

export default TicketShow;