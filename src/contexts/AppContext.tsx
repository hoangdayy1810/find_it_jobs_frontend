'use client'

import { applicationStore } from '@/stores/applicationStore';
import { candidateStore } from '@/stores/candidateStore';
import { employerStore } from '@/stores/employerStore';
import { jobStore } from '@/stores/jobStore';
import { paymentStore } from '@/stores/paymentStore';
import { specializationStore } from '@/stores/specializationSchema';
import { userStore } from '@/stores/userStore';
import React, { createContext, ReactNode, useContext } from 'react'

export interface AppContextProps {
    userStore: typeof userStore;
    candidateStore: typeof candidateStore;
    employerStore: typeof employerStore;
    jobStore: typeof jobStore;
    applicationStore: typeof applicationStore;
    specializationStore: typeof specializationStore;
    paymentStore: typeof paymentStore;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useUser = () => {
    const context = useContext(AppContext);
    if (context) return context.userStore;
};

export const useCandidate = () => {
    const context = useContext(AppContext);
    if (context) return context.candidateStore;
};

export const useEmployer = () => {
    const context = useContext(AppContext);
    if (context) return context.employerStore;
};

export const useJob = () => {
    const context = useContext(AppContext);
    if (context) return context.jobStore;
};

export const useApplication = () => {
    const context = useContext(AppContext);
    if (context) return context.applicationStore;
};

export const useSpecialization = () => {
    const context = useContext(AppContext);
    if (context) return context.specializationStore;
};

export const usePayment = () => {
    const context = useContext(AppContext);
    if (context) return context.paymentStore;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
    return (
        <AppContext.Provider
            value={{
                userStore,
                candidateStore,
                employerStore,
                jobStore,
                applicationStore,
                specializationStore,
                paymentStore
            }}
        >
            {children}
        </AppContext.Provider>
    );
}