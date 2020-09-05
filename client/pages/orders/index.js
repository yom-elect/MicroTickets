const OrdersList = ({ orders: { data } }) => {
    return <ul > {
            data.map(order => ( <
                li key = { order.id } > { order.ticket.title } - { order.status } <
                /li>
            ))
        } <
        /ul>
}

OrdersList.getInitialProps = async(context, client) => {
    const { data } = await client.get("/api/orders");
    return { orders: data }
}

export default OrdersList;