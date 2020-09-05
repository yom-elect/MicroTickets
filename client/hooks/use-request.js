import axios from "axios";
import {
    useState
} from "react";

const useRequestHook = ({
        url,
        method,
        body,
        onSuccess
    }) => {
        const [errors, setErrors] = useState(null);

        const doRequest = async(props = {}) => {
                try {
                    setErrors(null);
                    const response = await axios[method](url, {...body, ...props });
                    if (onSuccess) {
                        onSuccess(response.data);
                    }
                    return response.data;
                } catch (err) {
                    console.log(err);
                    setErrors( <
                        div className = "alert alert-danger" >
                        <
                        h4 > Ooops.... < /h4>  <
                        ul className = "my-0" > {
                            err.response.data.errors.map((err, i) => ( < li key = {
                                        i
                                    } > {
                                        err.message
                                    } < /li>))
                                } < /ul>    < /
                                div > );
                        }
                    };

                    return {
                        doRequest,
                        errors,
                    };
                };
                export default useRequestHook;