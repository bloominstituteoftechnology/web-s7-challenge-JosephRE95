import { text } from "express";

const Confirmation = (props) => {

    return(
    <div className={ props.success === true ? 'success' : 'failure' } >
        {props.text}
    </div>

    );
}