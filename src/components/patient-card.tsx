"use client";

import React from 'react';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useNavigate } from 'react-router-dom';

interface Person {
  id: number;
  visitId: string;
  first: string;
  last: string;
  visitDateTime: string;
}

const PersonCard: React.FC<{ person: Person }> = ({ person }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log("Person Data:", person);
    // Navigate using the numeric ID instead of visitId
    navigate(`/patient/${person.id}`, { state: { person } });
  };
  
  return (
    <Card isPressable={true}
      className="w-full h-full cursor-pointer hover:shadow-md transition-shadow"
      onPress={handleCardClick}
    >
      <CardHeader className="flex gap-3">
      <div className="flex flex-col items-baseline">
          <span className="text-md font-semibold ">{person.first}</span>
          <span className="text-small text-default-500">{person.last}</span>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex justify-between items-center">
          <p className="text-default-500">{person.visitDateTime}</p>
        </div>
      </CardBody>
    </Card>
  );
};

export default PersonCard;