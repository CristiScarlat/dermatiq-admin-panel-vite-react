import { createContext, useReducer, ReactNode, Dispatch } from 'react';

export interface IToast {
    showToast: boolean;
    type: 'Success' | 'Error' | 'Warning';
    headerText: string;
    bodyText: string;
}

export interface IUser {
        isAuthenticated: boolean,
        role: 'user' | 'admin',
        username: '',
        uid: number
}

interface IState {
    toast: IToast;
    user: IUser;
}

interface IAction {
    type: "SET_TOAST" | "SET_AUTH";
    payload: Partial<IState>; // Allows partial updates
}

const initialState: IState = {
    toast: {
        showToast: false,
        type: 'Success',
        headerText: '',
        bodyText: '',
    },
    user: JSON.parse(sessionStorage.getItem("user") || "null") || {
        isAuthenticated: false,
        role: 'user',
        username: ''
    },
};

interface IContextProps {
    state: IState;
    dispatch: Dispatch<IAction>;
}

// Provide a default value of `undefined` to enforce usage inside a Provider
export const Ctx = createContext<IContextProps | undefined>({state: initialState, dispatch: () => {} });

const reducer = (state: IState, action: IAction): IState => {
    switch (action.type) {
        case "SET_TOAST":
            return { ...state, toast: action.payload.toast ?? state.toast };
        case "SET_AUTH":
            sessionStorage.setItem("user", JSON.stringify(action.payload.user));
            return { ...state, user: action.payload.user ?? state.user };
        default:
            return state;
    }
};

const Provider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <Ctx.Provider value={{ state, dispatch }}>
            {children}
        </Ctx.Provider>
    );
};

export default Provider;
