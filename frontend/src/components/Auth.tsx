import { Link, useNavigate } from "react-router-dom";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>
                    <div className="px-10">
                        <div className="text-3xl font-extrabold font-serif">
                            Create an account
                        </div>
                        <div className="text-slate-500 font-serif sm:w-full">
                            {type === "signup" ? "Already have an account?" : "Don't have an account?"}
                            <Link className="pl-2 underline" to={type === "signup" ? "/signin" : "/signup"}>
                                {type === "signup" ? "Login" : "Sign up"}
                            </Link>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}