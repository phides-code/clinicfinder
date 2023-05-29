import { ReactNode, createContext, useState } from 'react';

interface UserProviderProps {
    children: ReactNode;
}

export interface CurrentUser {
    userType: 'patient' | 'clinician';
    patientId?: string;
    clinicId?: string;
    clinicName?: string;
    name: string;
    postalcode?: string;
    _id: string;
    email: string;
    phone: string;
}

interface UserContextProps {
    currentUser: null | CurrentUser;
    setCurrentUser: React.Dispatch<React.SetStateAction<null | CurrentUser>>;
    requestAppointment: boolean;
    setRequestAppointment: React.Dispatch<React.SetStateAction<boolean>>;
    messageSuccess: boolean;
    setMessageSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextProps>({
    currentUser: null,
    setCurrentUser: () => {},
    requestAppointment: false,
    setRequestAppointment: () => {},
    messageSuccess: false,
    setMessageSuccess: () => {},
});

export const UserProvider = ({ children }: UserProviderProps) => {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [requestAppointment, setRequestAppointment] = useState(false);
    const [messageSuccess, setMessageSuccess] = useState(false);

    return (
        <UserContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                requestAppointment,
                setRequestAppointment,
                messageSuccess,
                setMessageSuccess,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
