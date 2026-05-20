import {Link, useParams} from "react-router";

export default function UserPage() {
    let { userId } = useParams();

    return (
        <>
            <p>User: {userId}</p>
            <Link to="/">Home page</Link>
            <Link to="/about">About page</Link>
        </>
    )
}