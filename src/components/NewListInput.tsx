"use client";
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface NewListInputProps {
    onAdd: (name: string) => void;
}

const NewListInput: React.FC<NewListInputProps> = ({ onAdd }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleAddClick = () => {
        if (inputValue.trim()) {
            onAdd(inputValue.trim());
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            onAdd(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div className='pt-10 px-2 space-x-2 min-w-[310px] w-[310px]'>
            <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter new list name"
                className=''
            />
            <Button className='mt-2 cursor-pointer' onClick={handleAddClick} >Add List</Button>
        </div>
    );
};

export default NewListInput;