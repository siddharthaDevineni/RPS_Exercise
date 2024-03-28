"use client";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { ethers } from "ethers";
import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
import { useEffect, useState } from 'react';
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useBalance, useContractRead } from 'wagmi';
import { Address } from 'viem';
import { notification } from "~~/utils/scaffold-eth";

export const Winner = () => {
  let winner: string;
  let j1BalanceBeforeSolve: string = "";
  let j2BalanceBeforeSolve: string = "";
  let j1BalanceAfterSolve: string = "";
  let j2BalanceAfterSolve: string = "";
  let stakeNonZero: number;
  const {data: stake} = useContractRead({
    address: useDeployedContractInfo("RPS").data?.address as Address,
    abi: useDeployedContractInfo("RPS").data?.abi,
    functionName: "stake"
  })
  if(stake){
    stakeNonZero = Number(ethers.formatEther(stake));
  }
  const {data: j1} = useContractRead({ 
    address: useDeployedContractInfo("RPS").data?.address as Address,
    abi: useDeployedContractInfo("RPS").data?.abi,
    functionName: "j1"
  })
  const {data: j2} = useContractRead({
    address: useDeployedContractInfo("RPS").data?.address as Address,
    abi: useDeployedContractInfo("RPS").data?.abi,
    functionName: "j2"
  })
  if(stake){
    const {data: balj1BS} = useBalance({
      address: j1,
      onSuccess(data) {
        j1BalanceBeforeSolve = balj1BS?.formatted!;
      },
    })
    const {data: balj2BS} = useBalance({
      address: j2,
      onSuccess(data) {
        j2BalanceBeforeSolve = balj2BS?.formatted!;
      },
    })
  }
  if(!stake){
    const {data: balj1AS} = useBalance({
      address: j1,
      onSuccess(data) {
        j1BalanceAfterSolve = balj1AS?.formatted!;
      },
    })
    const {data: balj2AS} = useBalance({
      address: j2,
      onSuccess(data) {
        j2BalanceAfterSolve = balj2AS?.formatted!;
      },
    })
  }
  if (Math.abs(Number(j1BalanceBeforeSolve) - Number(j1BalanceAfterSolve)) == stakeNonZero!) {
    winner = "j1";
  }
  if (Math.abs(Number(j2BalanceBeforeSolve) - Number(j2BalanceAfterSolve)) == stakeNonZero!) {
    winner = "j2";
  }
  else{
    winner = "tie game";
  }

  const revealWinner = () => {
    console.log("winner is: ", winner);
    notification.success(`winner is: ${winner}`);
  }

  return (
    <div>
      <button className="button" onClick={revealWinner}>
        Click to reveal Winner!
      </button>
    </div>
  );
};