import React from 'react'
interface MyComponentProps {
    text: string;
}

const Footer_List_Li: React.FC<MyComponentProps> = ({ text }) => {
    return (
        <li className='text-sm py-2'>{text}</li>
    )
}

export default Footer_List_Li