import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


function Skeletonloading({height, count}) {
  return (
    <div>
        <Skeleton style={{height: `${height}px`, width:'100%'}} count={count}  />
    </div>
  )
}

export default Skeletonloading





// var message
// (() => {
//   //code here
//   var message

//   function a(){

//   }
// })()


// var message
// (() => {
//   //code here
//   var message
//   function a(){
    
//   }

// })()


//before let and const

// (function(){
//   var secret = 'I m hidden';
//   console.log('Inside IIFE', secret)
// })()

// console.log(typeof secret)


// for ( var i = 0 ; i < 5; i++){

//   (function(index){
//     setTimeout(() => {
//       console.log(index);
//     }, 1000)
//   })(i)

// }


// for ( let i = 0 ; i < 5; i++){
//     setTimeout(() => {
//       console.log(i);
//     }, 1000)
// }


// for ( var i = 0 ; i < 5; i++){
//     setTimeout(() => {
//       console.log(i);
//     }, 1000)
// }

// let a = 20

// {
//   let i = 0

// }
// {
//   let i = 5

// }

// () => {
//   var a = 0
// }

// ()=>{
//   var a = 1
// }

// (){
//   var a = 2
// }

// (){
//   var a = 3
// }
// (){
//   var a = 4
// }

// console.log(a)