"use client";

import { MessageEmployees, RootEmployees } from "@/types/employees";
import { MessageProduct, RootProduct } from "@/types/product";
import { MessageRequestProducts } from "@/types/requestProducts";
import { getAllFetchDataValues, patchEditVal } from "@/utils/api";
import { useEffect, useState } from "react";

export default function Product() {
  const [allDataRequest, setAllDataRequest] = useState<
    null | MessageRequestProducts[]
  >(null);
  const [selectDataRequest, setSelectDataRequest] =
    useState<null | MessageRequestProducts>(null);
  const [allDataProducts, setAllDataProducts] = useState<
    null | MessageProduct[]
  >(null);
  const [allDataEmployees, setAllDataEmployees] = useState<
    null | MessageEmployees[]
  >(null);

  const getAllProducts = async () => {
    await getAllFetchDataValues(
      `http://localhost:3000/api/v1/view-products`
    ).then((rec: RootProduct) => {
      // @ts-ignore
      setAllDataProducts(rec.details);
    });
  };
  const getAllRequest = async () => {
    await getAllFetchDataValues(
      `http://localhost:3000/api/v1/request-products`
    ).then((rec) => {
      // @ts-ignore
      setAllDataRequest(rec.details);
    });
  };

  const getAllDataEmployees = async () => {
    await getAllFetchDataValues(`http://localhost:3000/api/v1/employees`).then(
      (rec: RootEmployees) => {
        // @ts-ignore
        setAllDataEmployees(rec.message);
      }
    );
  };

  const updateTable = async(state:string)=>{
    await patchEditVal(
      `http://localhost:3000/api/v1/request-products/edit/${selectDataRequest?._id}`,
      {
        state: state
      },
      () => {
      },
      "requisito"
    );
  }

  const dateFormater = (fecha: Date) => {
    const year = fecha.getFullYear();
    const mes = ("0" + (fecha.getMonth() + 1)).slice(-2); // Sumar 1 ya que los meses van de 0 a 11
    const dia = ("0" + fecha.getDate()).slice(-2);
    const horas = ("0" + fecha.getHours()).slice(-2);
    const minutos = ("0" + fecha.getMinutes()).slice(-2);
    const segundos = ("0" + fecha.getSeconds()).slice(-2);
    return (
      <>
        {year}/{mes}/{dia}
        <span className="ms-3 font-normal">
          {horas}:{minutos}
        </span>
      </>
    );
  };

  useEffect(() => {
    getAllProducts();
    getAllDataEmployees();
    getAllRequest();
  }, []);

  // console.log(allDataEmployees?.filter(pr=>pr._id==allDataRequest[0].employee)[0].username)
  console.log(allDataRequest);
  console.log(allDataEmployees);
  console.log(allDataProducts);

  return (
    <>
      <div className="h-[100%]">
        <div className="hidden xl:flex flex-col items-start border-r-2 border-[#bbbcbc] pt-14 h-[100%]">
          <div className="flex flex-col items-start justify-center">
            <h1 className="text-[#000] text-2xl font-bold mb-1">Pendientes</h1>
          </div>
          <div className="flex flex-col">
            {allDataRequest &&
              allDataRequest
                .map((requestProd) => (
                  <div
                    onClick={() => setSelectDataRequest(requestProd)}
                    className={`${
                      requestProd == selectDataRequest ? "bg-slate-100" : ""
                    } flex flex-col text-[#000] items-start overflow-auto gap-2 hover:bg-slate-200 cursor-pointer`}
                  >
                    <div className=" px-2 min-w-60">
                      <p className="text-base font-semibold mb-2">
                        {
                          // @ts-ignore
                          allDataEmployees?.find(
                            (pr) => pr._id == requestProd.employee
                          ).username
                        }
                      </p>
                      {/* <p className="text-sm">Carro: {allDataEmployees?.filter(pr=>pr._id==requestProd.employee)[0].username}</p> */}

                      <p className="text-xs font-semibold text-right">
                        {dateFormater(new Date(requestProd.dateTime))}
                      </p>
                      <p className={`${requestProd.state==="pendiente"?"text-yellow-500":requestProd.state==="rechazado"?"text-orange-500":requestProd.state==="aprobado"?"text-lime-500":""} 
                          text-sm font-semibold text-right`}>
                        {requestProd.state}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      <div className="relative text-[#000] flex flex-col justify-center items-center gap-20 overflow-y-auto h-full max-h-[100vh]">
        {selectDataRequest && (
          <div className="flex flex-col w-full h-full pt-5">
            <h1 className="text-center font-bold text-xl mb-4">
              Requisito de productos
            </h1>
            <div className="flex justify-between px-4 pb-3">
              <button onClick={()=>updateTable("rechazado")}
                className="bg-red-300 w-fit px-3 py-1 rounded-full text-sm font-semibold hover:scale-105 duration-100">
                Rechazar pedido
              </button>
              <button  onClick={()=>updateTable("aprobado")} className="bg-lime-300 w-fit px-3 py-1 rounded-full text-sm font-semibold hover:scale-105 duration-100">
                Aceptar pedido
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {selectDataRequest.products.map((pr_product) => (
                <div className="flex w-full justify-center items-center gap-3">
                  {/* <button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 hover:animate-pulse text-red-700"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 7h16M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3m-5 5l4 4m0-4l-4 4"
                      />
                    </svg>
                  </button> */}
                  <div className=" w-2/3 bg-blue-100 p-3 rounded-xl">
                    <p className="text-center font-semibold">
                      {
                        allDataProducts?.find(
                          (u) => u._id == pr_product.product
                        )?.productName
                      }
                    </p>
                    <p className="text-base mt-2 text-slate-700 ">
                      {
                        allDataProducts?.find(
                          (u) => u._id == pr_product.product
                        )?.productDescription
                      }
                    </p>
                    <p className="text-sm font-semibold">
                      Cantidad solicitada: {pr_product.amount}
                    </p>
                    <p className="text-right text-sm font-bold mt-3">
                      {/* {product.productPrice}  */}
                      {
                        allDataProducts?.find(
                          (u) => u._id == pr_product.product
                        )?.productPrice
                      }
                      <span className="text-xs ps-1">MXN</span>
                    </p>
                  </div>
                  {/* <div className="flex items-center gap-1 font-bold text-xl">
                    <button
                      // disabled={(product?.productAmount ?? 0) === 0}
                      className="w-8 h-8 bg-red-200 rounded-md"
                      // onClick={() =>
                      //   handleUpdateProductSelect(
                      //     index,
                      //     (product?.productAmount ?? 0) - 1
                      //   )
                      // }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="flex w-14 text-center"
                      min={0}
                      // onChange={(e) =>
                      //   handleUpdateProductSelect(
                      //     index,
                      //     parseInt(e.target.value)
                      //   )
                      // }
                      // value={product.productAmount ?? 0}
                    />
                    <button
                      className="w-8 h-8 bg-green-200 rounded-md"
                      // onClick={() =>
                      //   handleUpdateProductSelect(
                      //     index,
                      //     (product?.productAmount ?? 0) + 1
                      //   )
                      // }
                    >
                      +
                    </button>
                  </div> */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
