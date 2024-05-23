import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";

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
};

interface LabelledInputType {
    label : string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return (
        <div>
            <label className="block mb-2 text-sm font-bold text-black pt-4 font-serif">
                {label}
            </label>
            <input
                onChange={onChange}
                type={type || "text"}
                id="first_name"
                className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder={placeholder}
                required
            />
        </div>
    )
}