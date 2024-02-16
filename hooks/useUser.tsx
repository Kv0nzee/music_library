'use client'

import { User } from "@supabase/auth-helpers-nextjs"; // Importing the User type from the Supabase library
import { useSessionContext, useUser as useSupaUser } from "@supabase/auth-helpers-react"; // Importing custom hooks for managing session and user data
import { createContext, useContext, useEffect, useState } from "react"; // Importing necessary hooks and utilities from React
import { UserDetails } from "@/type"; // Importing custom types

// Define the type for the context value
type UserContextType = {
    accessToken: string | null;
    user: User | null;
    userDetails: UserDetails | null;
    isLoading: boolean;
};

// Create the UserContext using createContext, initialized with undefined
export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

// Define interface for props
export interface Props{
    [propName: string] : any;
}

// Define the custom context provider component
export const MyUserContextProvider = (props: Props) => {
    // Destructure session, isLoadingUser, and supabaseClient from the useSessionContext hook
    const {
        session,
        isLoading: isLoadingUser,
        supabaseClient: supabase
    }  = useSessionContext();
    // Get the user object using the useSupaUser hook
    const user = useSupaUser();
    // Extract access token from the session object, defaulting to null if not present
    const accessToken = session?.access_token ?? null;
    // State variables to manage loading state and user details
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

    // Function to fetch user details from the database
    const getUserDetails = () => supabase.from('users').select('*').single();

    // useEffect hook to fetch data when the component mounts or user state changes
    useEffect(() => {
        if(user && !isLoadingData && !userDetails){
            setIsLoadingData(true);

            Promise.allSettled([getUserDetails()]).then(
                (results) => {
                    const userDetailsPromise = results[0];

                    if(userDetailsPromise.status === "fulfilled"){
                        setUserDetails(userDetailsPromise.value.data as UserDetails)
                    }

                    setIsLoadingData(false);
                }
            )
        }else if(!user && !isLoadingData && !isLoadingUser){
            setUserDetails(null);
        }
    }, [user, isLoadingData]);

    // Construct the value object with relevant data
    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
    };

    // Render the UserContext.Provider with the value passed as a prop
    return <UserContext.Provider value={value} {...props} />

}

// Custom hook to consume the user context
export const useUser = () => {
    // Use the useContext hook to access the UserContext
    const context = useContext(UserContext);
    // Throw an error if the context is undefined
    if(context === undefined){
        throw new Error("useUser must be used within a MyUserContextProvider")
    }

    // Return the context
    return context;
}