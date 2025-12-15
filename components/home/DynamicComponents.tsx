'use client';

import React from 'react';

interface DynamicComponentsProps {
    order: string[];
    componentMap: Record<string, React.ComponentType>;
}

export const DynamicComponents: React.FC<DynamicComponentsProps> = ({ order, componentMap }) => {
    // Footer được render riêng, không nằm trong main
    const filteredOrder = order.filter(type => type !== 'footer');

    return (
        <>
            {filteredOrder.map((type) => {
                const Component = componentMap[type];
                if (!Component) return null;
                return <Component key={type} />;
            })}
        </>
    );
};
