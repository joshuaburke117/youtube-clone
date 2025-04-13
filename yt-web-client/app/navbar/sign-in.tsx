'use client';

import { Fragment } from "react";

import { signInWithGoogle, signOut } from "../firebase/firebase";
import styles from './sign-in.module.css';
import {User} from 'firebase/auth';
interface SigninProps {
    user: User | null;
}

export default function SignIn({user}:SigninProps ){


    return (
        <Fragment>
            { user?
                (
                    <button className={styles.signin} onClick={signOut}>
                        Sign Out
                    </button>
                ) : (
                    <button className={styles.signin} onClick={signInWithGoogle}>
                        Sign In
                    </button>
                )

            }
        </Fragment>
    )
}