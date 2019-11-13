import React from "react";

export interface BudgetContext {
    account?: any;
}

const context = React.createContext<BudgetContext>({});

export const BudgetContextType = context;
export const BudgetContextProvider = context.Provider;
export const BudgetContextConsumer = context.Consumer;