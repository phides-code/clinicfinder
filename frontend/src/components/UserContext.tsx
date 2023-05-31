import { ReactNode, createContext, useState } from 'react';
import CryptoJS from 'crypto-js';

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
    invalidUser: boolean;
    setInvalidUser: React.Dispatch<React.SetStateAction<boolean>>;
    userLogin: (ev: React.FormEvent<HTMLFormElement>) => Promise<void>;
    redirectToRoute: (route: string) => void;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    newMessages: boolean;
    setNewMessages: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextProps>({
    currentUser: null,
    setCurrentUser: () => {},
    requestAppointment: false,
    setRequestAppointment: () => {},
    messageSuccess: false,
    setMessageSuccess: () => {},
    invalidUser: false,
    setInvalidUser: () => {},
    userLogin: async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
    },
    redirectToRoute: (_: string) => {},
    isLoading: false,
    setIsLoading: () => {},
    newMessages: false,
    setNewMessages: () => {},
});

export const UserProvider = ({ children }: UserProviderProps) => {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [requestAppointment, setRequestAppointment] = useState(false);
    const [messageSuccess, setMessageSuccess] = useState(false);
    const [invalidUser, setInvalidUser] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newMessages, setNewMessages] = useState(false);

    const redirectToRoute = (route: string) => {
        const currentDomain = window.location.origin;
        const loginUrl = currentDomain + route;
        window.location.href = loginUrl;
    };

    const userLogin = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const target = ev.target as HTMLFormElement;

        console.log(`verifying patientId: ${target.patientId.value}`);
        const hashedPassword = CryptoJS.AES.encrypt(
            target.password.value,
            'hello'
        ).toString();

        try {
            setIsLoading(true);
            const res = await fetch('/api/users/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: target.patientId.value,
                    password: hashedPassword,
                }),
            });
            const data = await res.json();

            if (data.status === 200) {
                // valid login
                console.log('valid login');
                setCurrentUser(data.user);
                localStorage.setItem('healthUser', target.patientId.value);
                localStorage.setItem('healthUserHash', hashedPassword);

                redirectToRoute('/');
            } else if (data.status === 403) {
                // invalid login
                console.log('invalid login');
                setInvalidUser(true);
                target.patientId.value = '';
                target.password.value = '';
            } else {
                window.alert(`got unexpected status:
        ${data.status}: ${data.message}`);
            }
        } catch (err) {
            console.log(`userLogin caught an error:`);
            console.log(err);
            window.alert(`userLogin caught an error...`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <UserContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                requestAppointment,
                setRequestAppointment,
                messageSuccess,
                setMessageSuccess,
                invalidUser,
                setInvalidUser,
                userLogin,
                redirectToRoute,
                isLoading,
                setIsLoading,
                newMessages,
                setNewMessages,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
