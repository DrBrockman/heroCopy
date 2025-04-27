"use client";

import React from 'react';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useNavigate } from 'react-router-dom';

interface Person {
  id: number;
  first: string;
  last: string;
  date: string;
}

const PersonCard: React.FC<{ person: Person }> = ({ person }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    
    console.log("Person Data:", person);
    navigate(`/patient/${person.id}`, { state: { person } });
  };
  

  return (
    <Card isPressable={true}
      className="w-full h-full cursor-pointer hover:shadow-md transition-shadow"
      onPress={handleCardClick}
    >
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <span className="text-md font-semibold ">{person.first}</span>
          <span className="text-small text-default-500">{person.last}</span>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex justify-between items-center">
          <p className="text-default-500">{person.date}</p>
        </div>
      </CardBody>
    </Card>
  );
};

export default PersonCard;