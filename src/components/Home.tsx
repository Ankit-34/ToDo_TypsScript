import { SetStateAction, useEffect, useState } from 'react'
import { Button, Input, Modal, Table, DatePicker, Tooltip } from 'antd'
import moment from 'moment';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons'
import '../Style/Home.css'
import { useLocation, useSearchParams } from 'react-router-dom';
import Header from './Header'
import type { ColumnsType, ColumnGroupType } from 'antd/es/table';

interface ColumnType {
    key : string;
    title : string;
    dataIndex? : number;
    sorter? (a: ColumnType, b: ColumnType) : number ;
    sortDirections? : string[];
    render?: (record: DataType) => JSX.Element;
  }

interface DataType {
    key? : number | undefined,
    task? : string | undefined,
    date? : string
  }

  type EventValue<DateType> = DateType | null;
type RangeValue<DateType> = [EventValue<DateType>, EventValue<DateType>] | null;



const Home = () => {
    
    const data : DataType[] | undefined = JSON.parse(localStorage.getItem('list')||"[]");   
    const columns : ColumnGroupType<DataType> | ColumnsType<DataType> = [
        {
            key:'1',
            title:"Task",
            dataIndex: 'task',
        },
        {
            key:'2',
            title:"Date",
            dataIndex: 'date',
            sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
            sortDirections: ['ascend']
        },
        {
            key:'3',
            title:"Options",
            render: (record) => {
                return (
                    <>
                        <Tooltip title="Edit Task">
                            <EditOutlined onClick={()=>{
                                onEditStudent(record);
                            }}
                            style={{
                                margin: "5px",
                                color: "black",
                                fontSize: "18px"
                                }}
                            />
                        </Tooltip>

                        <Tooltip title="Delete Task">
                            <DeleteOutlined 
                                onClick={()=>{
                                    onDeleteStudent(record);
                                }}
                                style={{
                                    margin: "5px",
                                    color: "red",
                                    fontSize: "17px",
                                }}
                            />
                        </Tooltip>
                    </>
                );
            },
        }   
    ];

    const date = new Date().toJSON().slice(0, 10);

    const [dataSource, setDataSource] = useState<DataType []>(data || []); 
    const [totalTask, setTotalTask] = useState(0);
    const [currPage, setCurrPage] = useState<number>(1);
    const [key, setKey] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [editingStudent, setEditingStudent] = useState<DataType | null>(null);
    const [isNewStudent, setIsNewStudent] = useState<boolean>(false);
    const [newStudent, setNewStudent] = useState<DataType>({key : key, task : "", date : ""});
    const [filterTriger, setFilterTriger] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams('');
    const location = useLocation();
    
    useEffect(()=>{
        if(searchParams.get('pageno')!==null)    
            setCurrPage(JSON.parse(searchParams.get('pageno') || "1"));
    }, [])

    useEffect(()=>{
        localStorage.setItem('list', JSON.stringify(dataSource));
        console.log()
    }, [dataSource])

    useEffect(()=>{
        setCurrPage(JSON.parse(searchParams.get('pageno') || "1"));
        fetchDataForCurrPage(currPage);
        console.log("Going for fetch ....")
    }, [location.search])

    console.log();

    const handleAddStudent = () => {
        setIsNewStudent(true);
    }

    const onEditStudent = (record : DataType) => {
        setIsEditing(true);
        setEditingStudent({...record});
    }

    const onDeleteStudent = (record : DataType) => {
        Modal.confirm({
            title: "Are you sure ?",
            okText: "Delete",
            onOk: () => {
                setTotalTask(totalTask-1);
                setDataSource((prev)=>{
                    if(prev){
                        return prev.filter(student => student.key !== record.key);
                    }
                    else {
                        return [];
                    }
                });
            },
        });
    };

    const fetchDataForCurrPage = (page : number) => {
        // const altered : DataType[] = JSON.parse(JSON.parse(searchParams.get('list'))).slice((+page*2)-2,+page*2);
        // setFilteredData(altered);
    }

    const resetEditing = () => {
        setIsEditing(false);
        // Here
        setEditingStudent(null);
    }

    const [filteredData, setFilteredData] = useState<DataType []>([]);

    const handleDateChange = (dates : RangeValue<any>, formatString: [string, string]) : void => {
        if(dates===null)
        {   
            setFilterTriger(false);
            setDataSource(dataSource);
            setTotalTask(dataSource?.length || 0);
        }
        else{
            // const startDate = actDates[0].toString();
            // const endDate = actDates[1].toString();
            
            // const filtered : DataType[] | null = dataSource?.filter((item)=> {
            //     const itemDate = item?.date;
            //     if(itemDate!==undefined){
            //         return itemDate>=startDate && itemDate<=endDate;
            //     }
            //     return null; 
            // }) as (DataType[] | null);
            // setFilterTriger(true);
            // setFilteredData((prev)=>{
            //     return filtered
            // });
            // setTotalTask(filtered?.length || 0);
        }
    }

    // Here
    const updateDataSource = (prev:DataType[] | undefined) => {
            if(prev) {
                return prev.map((student : DataType) => {
                if(student.key=== editingStudent?.key)
                {
                    return editingStudent;
                }
                else{
                    return student;
                }
            })
        }
    };


  return (
    <div className='container'>

        <Header />

        <div className='dp_outer'>
            <p className='filterby'>Filter By : </p>
            <DatePicker.RangePicker 
            className='datepicker'
            onChange={handleDateChange} 
            />
            <Button className='add-btn' onClick={handleAddStudent}>
                Add Task
            </Button>
        </div>


        <Table
        className='table'
            columns={columns}
            dataSource={filterTriger ? filteredData : dataSource} 
            pagination={{ total:totalTask, defaultPageSize: 2, current:+currPage, onChange: (page)=>{
                setSearchParams(`pageno=${page}`);
                setCurrPage(page); 
                fetchDataForCurrPage(page);
            }}}
            rowClassName = {(record : DataType) =>  record?.date && date>record.date ? "invalid" :  "valid"
            }
        >
        </Table>            
        <Modal
            style={{
                    width: "50%"
                }}
            title="Edit Student"
            open={isEditing}    
            onCancel={()=>{
                resetEditing();
            }}
            onOk={()=>{updateDataSource
                resetEditing();}}
        >
            <Input 
                style={{
                    padding: "5px",
                    margin: "10px 0"
                }}
                value={editingStudent?.task}
                onChange={(e)=>{
                    setEditingStudent((prev)=>{
                        return {
                            ...prev, 
                            task:e.target.value
                        }
                    })
                }}
            />
            <Input  
                type='date'
                value={editingStudent?.date} 
                className={newStudent?.date && date>newStudent?.date ? 'invalid' :  'valid'}
                onChange={(e)=>{
                    setEditingStudent((prev)=>{
                        return {
                            ...prev, 
                            date:e.target.value}
                    })
                }}
                />

        </Modal>

        <Modal
            title="Add student"
            open={isNewStudent}
            okText= "Save"
            okButtonProps={{ style: { backgroundColor: 'black', color: 'white' } }} 
            onCancel={()=>setIsNewStudent(false)}
            onOk={()=>{
                    setDataSource([...dataSource, newStudent]);
                    setTotalTask(totalTask+1);
                    setKey(key+1);
                    setIsNewStudent(false);
                    setSearchParams(`pageno=${currPage}`);
            }}
        >
                <Input 

                    style={{
                        padding: "5px",
                        margin: "10px 0"
                    }}
                    type='text'
                    name='text'
                    placeholder='Add your task'
                    onChange={(e)=>{
                        setNewStudent((prev) => {
                            return{
                                ...prev,
                                key : key,
                                task : e.target.value
                            }
                        })
                    }}
                    required
                />
                <Input 
                    name='date'
                    type='date'
                    onChange={(e)=>{
                        setNewStudent((prev) => {
                            return{
                                ...prev,
                                date : e.target.value
                            }
                        })
                    }}
                    required
                />

        </Modal>
        
        
    </div>
  )
}

export default Home