'use client';

import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css"
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { unsubscribe } from "diagnostics_channel";
import {User} from 'firebase/auth';
//closure 



export default function Navbar(){
    //init user state
    const [user, setUser] = useState<User | null>(null);

    useEffect(()=>{
        const unsubscribe = onAuthStateChangedHelper((user)=>{
            setUser(user);
        });

        return() => unsubscribe();
    });
    return(
        <nav className={styles.nav}>
            <Link href="/">
                    <Image width= {90} height={20}
                    src="/youtube-logo.svg" alt="Youtube Logo"/>
            </Link>
            {
                //TODO: add a upload button
            }
            <SignIn user={user}/>
        </nav>
    )
}