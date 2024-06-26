import * as React from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Chip } from '@mui/material';
import styles from "./CheckMyCar.module.css"
import {useEffect, useState} from "react";
import {getServiceCarList} from "../../api/CarApiService";

export default function RegisterCarCard({ car, onAddService, onDeleteCar }) {
    const [serviceCar, setServiceCar] = useState(false)

    useEffect(() => {
        getServiceCarList(car.carId)
            .then(res => {
                //console.log(res.data)
                if(res.data.length > 0){
                    setServiceCar(true);
                }
            })
    })
    const imageUrl = "https://kr.object.ncloudstorage.com/bitcamp-6th-bucket-102/cars/" + car.carImages.main_image;
    console.log(imageUrl)
    return (
        <div>
            <Card sx={{ maxWidth: 345, marginTop: '30%', marginBottom: "10px", marginX: '10%', boxShadow: 5 }}>
                <CardMedia
                    sx={{ height: 240 }}
                    image={imageUrl} // 이미지 경로에 맞게 조정하세요.
                    title={car.model}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {car.model} - {car.color}
                    </Typography>
                    <Chip label={car.category} color="primary" sx={{ marginBottom: 2 }} />
                    <h3 style={{ margin: 0 }}>{car.title}</h3>
                    <Typography variant="body2" color="text.secondary">
                        {car.content}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ justifyContent: 'space-between' }}>
                    <Button size="small" color="error" onClick={() => onDeleteCar(car.carId)}>삭제하기</Button>
                    <Button disabled={serviceCar} size="small" onClick={() => onAddService(car.carId)}>해당 차량 서비스등록</Button>
                </CardActions>
            </Card>
        </div>
    );
}
