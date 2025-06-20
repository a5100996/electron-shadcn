import React from "react"
import { useNavigate, useLocation, useParams, useRouter } from "@tanstack/react-router"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionHeader,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogClose,
    DialogContent,
    //DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
//import Footer from "@/components/template/Footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { addDays, format } from "date-fns"
import { resizeImage } from "@/utils/resize_image";
import { cn } from "@/utils/misc"
import { useTranslation } from "react-i18next"
import { setAppLanguage } from "@/helpers/language_helpers"
import { Asterisk, ArrowLeft, CalendarIcon, CircleX, Copy, FileImage, Plus } from "lucide-react"
export default function AddEditViewSample() {
    const { t, i18n } = useTranslation()

    //const writable = import.meta.env.VITE_WRITABLE
    //const writable = 0
    const [writable, setWritable] = React.useState(true)

    // // Next line fails when we open this component/page in a new window
    //const { ipcRenderer } = window.require('electron')

    const router = useRouter()
    const location = useLocation()

    const navigate = useNavigate()

    // // id from url
    const { id } = useParams({})

    // // On init, "id" above is copied into "eyed" below.
    // // After a new sample is created, "eyed" will have that sample's id
    const [eyed, setEyed] = React.useState(-1)

    const currentDate = new Date()

    const [categories, setCategories] = React.useState([])

    // // samples
    const [category, setCategory] = React.useState('')
    const [productNo, setProductNo] = React.useState('')
    const [drawingNo, setDrawingNo] = React.useState('')
    const [unitPrice, setUnitPrice] = React.useState(0.00)
    const [material, setMaterial] = React.useState('')
    const [strengthTest, setStrengthTest] = React.useState('')
    const [dimensionCheck, setDimensionCheck] = React.useState('')
    const [sampleDate, setSampleDate] = React.useState<Date>(
        addDays(currentDate, -3)
    )
    const [moldReleaseDate, setMoldReleaseDate] = React.useState<Date>(
        addDays(currentDate, 14)
    )

    // // store as text and then slurped into a BLOB for sqlite3
    // const [image, setImage] = React.useState('')
    //const [image, setImage] = React.useState('')
    const [imageBlob, setImageBlob] = React.useState('')

    // // item_codes
    // // next one links to the parent samples table
    // const [sampleId, setSampleId] = React.useState(0)
    // const [name, setName] = React.useState('')
    // const [colorCode, setColorCode] = React.useState('')
    // const [confirmationDate, setConfirmationDate] = React.useState<Date>()
    // const [remark, setRemark] = React.useState('')

    // // pagination for item codes
    const [page, setPage] = React.useState(1)
    const [pageCount, setPageCount] = React.useState(1)
    const [recordCount, setRecordCount] = React.useState(1)
    const limit = 5
    const [visiblePages, setVisiblePages] = React.useState([])
    const [hasLeftElipsis, setHasLeftElipsis] = React.useState(false)
    const [hasRightElipsis, setHasRightElipsis] = React.useState(false)
    // // Next one is the list of item code
    const [rows, setRows] = React.useState([])
    const [triggerSearch, setTriggerSearch] = React.useState(0)

    const [expandedAccordionItems, setExpandedAccordionItems] = React.useState([])

    const [grayIdVisibility, setGrayIdVisibility] = React.useState(false)

    React.useEffect(() => {

        console.log("useEffect: <<<<<<<<<<<<<<<<<<<<<")
        console.log("useEffect: location.pathname = ", location.pathname)
        console.log("useEffect: location.search = ", JSON.stringify(location.search))
        // // of course, global is not defined
        // console.log("useEffect: global.apeye.yourl = ", global.apeye.yourl)
        console.log("useEffect: window.apeye.yourl = ", window.apeye.yourl)
        console.log("useEffect: window.apeye.language = ", window.apeye.language)
        console.log("useEffect: current language = ", i18n.language)
        console.log("useEffect: >>>>>>>>>>>>>>>>>>>>>>")

        if (window.apeye.language !== undefined) {
            setAppLanguage(window.apeye.language, i18n)
        }

        // // Is there "/view-sample/" in the path ?
        if ((location.pathname).includes("view-sample")) {
            setWritable((oldValue) => false)
        }

        console.log("useEffect: writable =", writable)

        let id_for_query = -1

        //if (id) {
        //if (id === undefined) {
        if (window.apeye.yourl) {
            const yourl = window.apeye.yourl
            if (yourl != "" || yourl !== undefined) {
                // // For url such as "/add-edit-sample"
                // // id_for_query below will be "add-edit-sample"
                // // For url such as "/add-edit-sample/" (i.e. no number at the end)
                // // id_for_query below will be ""
                id_for_query = yourl.split("/").pop()
                const trashArray = ["", "add-edit-sample"]
                if ( trashArray.includes(String(id_for_query)) ) {

                    console.log("this is an add operation as no id detected")

                    // // reset id_for_query so it woill not have a weird value like "add-edit-sample"
                    id_for_query = -1
                } else {
                    setEyed((oldValue) => id_for_query)
                }
            }
        } else {
            id_for_query = id ?? id_for_query

            // // The next line wont take effect instantly, leading to queries for id -1 :/
            //setEyed(id)
            if (id !== undefined) {
                setEyed((oldValue) => id)
            }
        }

        console.log('------------------------------------------------')
        console.log('useEffect: id vs eyed vs id_for_query:', id, ' vs ', eyed, ' vs ', id_for_query)
        console.log('------------------------------------------------')

        initCategories()
        //initSample()
        initSample(id_for_query)
    }, [])

    React.useEffect(() => {
        search(
            //new CustomEvent("search", { value: eyed })
        )
        //}, [page])
    }, [triggerSearch])

    // // when the item codes list changes, refresh:
    // // 1) the relevant pagination
    // // 2) the array which tracks the clicked accordion items
    React.useEffect(() => {
        buildVisiblePageNumbers()
        setExpandedAccordionItems((oldValue) => [])
    }, [rows])

    const toggleEyed = () => {
        setGrayIdVisibility((oldValue) => !oldValue)
    }

    const initCategories = async () => {
        /* await ipcRenderer.invoke("getCategories").then((response) => {
            setCategories((old) => { return response })
        }) */
        const ipcResponseName = "categories";
        const ipcRequestName = "getCategories";

        //console.log("initCategories: ===uuu===uuu===uuu===uuu===")

        window.apeye.receive(ipcResponseName, (data) => {

            console.log(`${ipcResponseName} from main process returns an array of length ${data.length}`)
            //console.log(JSON.stringify(data));

            setCategories((old) => { return data })
        });

        //console.log("initCategories: ---^^^---^^^---^^^---^^^---")

        window.apeye.send(ipcRequestName, {});
    }

    const initSample =
        //async () => {
        async (actualId: number | undefined) => {

        // // eyed betrayed us ...
        //let actualId = eyed == -1 ? id : eyed

        console.log('------------------------------------------------')
        console.log('initSample: id vs eyed vs actualId :', id, ' vs ', eyed, ' vs ', actualId)
        console.log('------------------------------------------------')

        // only if id is defined, do we fetch the sample from the database
        if (actualId === undefined || actualId == -1) {

            console.log('initSample: no id to fetch')

            // // angrily inform user
            // toast.error(t("unable_to_fetch_sample"))

            return
        }

        //const query = "SELECT * FROM samples WHERE id = ?"
        const query = "SELECT a.*, b.B_L_O_B as eemage "
            + "FROM samples a LEFT JOIN images b "
            + "ON a.ID = b.SAMPLE_ID "
            + "WHERE a.ID = ?"

        const values = [actualId]

        const params = {
            query: query,
            values: values,
            //pagination: pagination
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        const ipcResponseName = "many"
        const ipcRequestName = "fetchMany"

        window.apeye.receive(ipcResponseName, (response) => {
            const row = response.rows[0]

            console.log('++++++++++oooooooo+++++++++++')
            console.log(`${ipcResponseName} from main process returns : row.ID = ${row.ID} ; row.UNIT_PRICE = ${row.UNIT_PRICE}`)
            console.log('++++++++++oooooooo+++++++++++')

            setCategory((oldValue) => row.CATEGORY)
            setProductNo((oldValue) => row.PRODUCT_NO)
            setDrawingNo((oldValue) => row.DRAWING_NO)

            setSampleDate((oldValue) => row.SAMPLE_DATE)

            setMoldReleaseDate((oldValue) => row.MOLD_RELEASE_DATE)
            //setMoldReleaseDate((oldValue) => { return new Date(row.MOLD_RELEASE_DATE) })
            //setMoldReleaseDate((oldValue) => row.MOLD_RELEASE_DATE ? new Date(row.MOLD_RELEASE_DATE) : new Date())

            setUnitPrice((oldValue) => row.UNIT_PRICE)
            setMaterial((oldValue) => row.MATERIAL)
            setStrengthTest((oldValue) => row.STRENGTH_TEST)
            setDimensionCheck((oldValue) => row.DIMENSION_CHECK)

            setImageBlob((oldValue) => row.eemage)
        })

        window.apeye.send(ipcRequestName, params)

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //search(actualId)
        setTriggerSearch((oldValue) => oldValue + 1)
    }

    const search = async () => {

        let actualId: number | undefined = eyed

        actualId = actualId ?? id

        console.log('------------------------------------------------')
        console.log('search: id vs eyed vs actualId :', id, ' vs ', eyed, ' vs ', actualId)
        console.log('------------------------------------------------')

        // only if id is defined, do we fetch the sample from the database
        if (actualId == -1) {

            console.log('search: no id to fetch')

            // // angrily inform user
            //toast.error(t("unable_to_fetch_item_codes"))

            return
        }

        const queryItemCodes = "SELECT * FROM item_codes "
            + "WHERE SAMPLE_ID = ? "
            //+ "ORDER BY CONFIRMATION_DATE"

        const values = [actualId]

        const pagination = { limit: limit, page: page }

        const params = {
            query: queryItemCodes,
            values: values,
            pagination: pagination
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        // // This pair has already been used earlier, so ...
        //const ipcResponseName = "many"
        //const ipcRequestName = "fetchMany"

        // // ... to avoid the potential criss crossing of events, use a new one
        const ipcResponseName = "many_2"
        const ipcRequestName = "fetchMany_2"

        window.apeye.receive(ipcResponseName, (response) => {

            console.log("search: params =", JSON.stringify(params)?.substring(0, 256), ' ... [trimmed]')
            console.log("search: response.rows =", JSON.stringify(response.rows))

            if (response && response.rows) {

                const p_c = Math.ceil(response.totalResultCount / response.limit)
                setPageCount((oldValue) => p_c)

                setRecordCount((oldValue) => response.totalResultCount)

                setRows((prevRows) => {
                    // Perform calculations with updatedItems here
                    return response.rows
                })
            } else {
                // // Clear samples pagination values
                //setPage(0)
                setPage(1)
                setPageCount(0)
                setRecordCount(0)
                setRows([])
            }
        })

        window.apeye.send(ipcRequestName, params)
    }

    const buildVisiblePageNumbers = () => {
        const visiblePageNumberCount = 5
        let hasLeftElipsis = false
        let hasRightElipsis = false

        let visiblePages = []

        if (pageCount > visiblePageNumberCount) {
            // // Here we determine which pages will be displayed as links
            let pagePrev = page - 1
            let pageNext = page + 1
            let pages = [page]

            do {
                if (pagePrev > 0) {
                    pages.push(pagePrev)
                    pagePrev--
                }

                if (pageNext <= pageCount) {
                    pages.push(pageNext)
                    pageNext++
                }
            } while (pages.length < visiblePageNumberCount)

            pages.sort((a, b) => a - b)

            // // Should there be a left elipsis ?
            if (pages[0] != 1)
                hasLeftElipsis = true

            // // Should there be a right elipsis ?
            if (pages[pages.length - 1] != pageCount)
                hasRightElipsis = true

            visiblePages = pages

        } else {

            visiblePages = Array.from(
                { length: pageCount },
                (_, i) => 1 + i)

        }

        setVisiblePages((oldValue) => visiblePages)
        setHasLeftElipsis((oldValue) => hasLeftElipsis)
        setHasRightElipsis((oldValue) => hasRightElipsis)
    }

    const trackClickedAccordionItems = (row_id: number) => {
        if (expandedAccordionItems.includes(row_id)) {
            const shallow_copy = expandedAccordionItems.filter(ev => ev !== row_id)
            // // Remove from list of open accordion items
            setExpandedAccordionItems((oldValue) => shallow_copy)
        } else {
            setExpandedAccordionItems(existingValue => {
                return [...existingValue, row_id]
            })
        }
        return true
    }

    const isBlank = (str) => {
        return (!str || /^\s*$/.test(str));
    }

    const saveSample = async (event) => {
        event.preventDefault()
        event.stopPropagation()

        console.log("saveSample invoked")
        console.log("saveSample : eyed =", eyed)
        console.log("saveSample : productNo =", productNo)
        console.log("saveSample : sampleDate =", sampleDate)
        //console.log("saveSample : imageBlob =", imageBlob)

        // // make sure these are not empty
        if (isBlank(category) || isBlank(productNo)) {

            // // angrily inform user
            toast.error(t("please_fill_in_the_mandatory_fields"))

            // // and abort the save
            return false
        }

        const formData = {
            id: eyed,
            qategory: category,
            product_no: productNo,
            drawing_no: drawingNo,
            sample_date: sampleDate,
            mold_release_date: moldReleaseDate,
            unit_price: unitPrice,
            material: material,
            strength_test: strengthTest,
            dimension_check: dimensionCheck,

            image_blob: imageBlob,
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        const ipcResponseName = "sampleSaved"
        const ipcRequestName = "saveSample"

        window.apeye.receive(ipcResponseName, (response) => {
            // // we'll get an object, not a JSON string
            console.log(`${ipcResponseName} from main process returns :`, JSON.stringify(response))
            //console.log("saveSample: response.id =", response.id)
            //console.log("saveSample: response.product_no =", response.product_no)
            //console.log("saveSample: response.qategory =", response.qategory)
            //console.log("saveSample: response.sampleDate =", response.sampleDate)

            if (response.id && response.id != eyed) {
                setEyed((currentValue) => {
                    // Perform calculations here
                    return response.id
                })
            }

            console.log('------------------------------------------------')
            console.log("saveSample: response.id vs eyed : ", response.id, " vs ", eyed)
            console.log('------------------------------------------------')
            console.log("saveSample: ... is there gonna be a page refresh ?")

            // // inform user
            toast.success(t("record_saved"))

            // // tell search page to refresh its list
            tellSearchPageToTriggerSearch()
        })

        window.apeye.send(ipcRequestName, formData)
    }

    const tellSearchPageToTriggerSearch = async () => {
        const ipcRequestName = "tellSearchPageToTriggerSearch"
        window.apeye.send(ipcRequestName, { id: eyed })
    }

    // // START: methods for item code add/edit dialog
    const [itemCodeName, setItemCodeName] = React.useState('')
    const [itemCodeColorCode, setItemCodeColorCode] = React.useState('')
    const [itemCodeConfirmationDate, setItemCodeConfirmationDate] =
        React.useState<Date>(currentDate)
    const [itemCodeRemark, setItemCodeRemark] = React.useState('')

    // // Reset item code form fields
    const resetItemCodeFormFields = () => {
        //setItemCodeName("")
        //setItemCodeColorCode("")
        //setItemCodeConfirmationDate(currentDate)
        //setItemCodeRemark("")
        setItemCodeName((oldValue) => "")
        setItemCodeColorCode((oldValue) => "")
        setItemCodeConfirmationDate((oldValue) => currentDate)
        setItemCodeRemark((oldValue) => "")
    }

    const editItemCode = async (event) => {
        // // Prevent the parent AccordionTrigger from getting this event
        event.stopPropagation()

        console.log("editItemCode: event.value =", event.value)

        const foundElement = rows.find(element => element.ID === event.value)
        if (foundElement) {

            console.log(`element with ID ${event.value} found in cache`)

            // // Why ? So that fields which were not edited, 
            // // therefore no change event to save their values, 
            // // will not go empty when we exit the dialog
            //setItemCodeName(foundElement.NAME)
            setItemCodeName((oldValue) => foundElement.NAME)
            //setItemColorCode(foundElement.COLOR_CODE)
            setItemCodeColorCode((oldValue) => foundElement.COLOR_CODE)
            //setItemCodeConfirmationDate(foundElement.CONFIRMATION_DATE)
            setItemCodeConfirmationDate((oldValue) => foundElement.CONFIRMATION_DATE)
            //setItemCodeRemark(foundElement.REMARK)
            setItemCodeRemark((oldValue) => foundElement.REMARK)
        } else {

            console.log(`element with ID ${event.value} **not** found in cache`)

            resetItemCodeFormFields()
        }

    }

    const saveItemCode = async (event) => {
        // // Next one prevents the clearing of the form fields
        //event.stopPropagation()

        // // Next one prevents the closing of the popup
        //event.preventDefault()

        console.log("saveItemCode invoked")
        console.log("saveItemCode : eyed =", eyed)
        console.log("saveItemCode : itemCodeName =", itemCodeName)
        console.log("saveItemCode : itemCodeConfirmationDate =", itemCodeConfirmationDate)

        // // make sure these are not empty
        if (isBlank(eyed) || isBlank(itemCodeName)) {

            event.preventDefault()

            // // angrily inform user
            toast.error(t("please_fill_in_the_mandatory_fields"))

            // // and abort the save
            return false
        }

        // // This is our updated local copy. Its "ID" might be undefined (or -1) at this point
        const updatedItemCode = {
            // // fixed
            ID: event.value,
            // // fixed
            SAMPLE_ID: eyed,
            NAME: itemCodeName,
            COLOR_CODE: itemCodeColorCode,
            //CONFIRMATION_DATE: itemCodeConfirmationDate,
            CONFIRMATION_DATE: itemCodeConfirmationDate ? format(itemCodeConfirmationDate, "yyyy/MM/dd") : null,
            REMARK: itemCodeRemark,
        }

        console.log("saveItemCode. updatedItemCode =", JSON.stringify(updatedItemCode))



        // // make sure these are not empty
        // // BTW, user has no direct control of eyed :)
        if (isBlank(eyed) || isBlank(itemCodeName)) {

            // // angrily inform user
            toast.error(t("please_fill_in_the_mandatory_fields"))

            // // and abort the save
            return false
        }

        const formData = {
            id: event.value,
            sample_id: eyed,
            //name: name,
            name: itemCodeName,
            color_code: itemCodeColorCode,
            confirmation_date: itemCodeConfirmationDate ? format(itemCodeConfirmationDate, "yyyy-MM-dd") : null,
            remark: itemCodeRemark,
        }

        let isUpdate = true
        if (event.value == -1) {
            isUpdate = false
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        const ipcResponseName = "itemCodeSaved"
        const ipcRequestName = "saveItemCode"

        window.apeye.receive(ipcResponseName, (response) => {
            // // we'll get an object, not a JSON string
            console.log(`${ipcResponseName} from main process returns: `,
                //response
                JSON.stringify(response)
            )

            const firstReturnedRow =
                //response[0]
                response

            //if (!isUpdate) {
            if (firstReturnedRow.ID && firstReturnedRow.ID != eyed) {
                updatedItemCode.ID = firstReturnedRow.ID
            }

            // // inform user
            toast.success(t("record_saved"))

            // // tell search page to refresh its list
            tellSearchPageToTriggerSearch()

            // // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            // resetItemCodeFormFields()

            // // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            let updatedItemCodes = []
            if (isUpdate) {
                // // Update the object locally
                updatedItemCodes = rows.map((item) => item.ID === updatedItemCode.ID ? updatedItemCode : item);

                console.log("saveItemCode: updated item code locally")

            } else {
                // // Append the object locally
                updatedItemCodes = [...rows, updatedItemCode]

                console.log("saveItemCode: appended new item code locally")

            }
            setRows((oldValue) => updatedItemCodes)
        })

        window.apeye.send(ipcRequestName, formData)
    }

    const deleteItemCode = async (event) => {
        // // Prevent the parent AccordionTrigger from getting this event
        event.stopPropagation();

        console.log(`removing item code with id ${event.value}`)

        const params = event.value

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        const ipcResponseName = "itemCodeDeleted"
        const ipcRequestName = "deleteItemCode"

        window.apeye.receive(ipcResponseName, (response) => {

            console.log(`deleteItemCode: ${ipcResponseName} from main process returns :`, response)

            // // Remove item locally
            setRows(existingValue => {
                return existingValue.filter(ev => ev.ID !== event.value)
            })

            // // inform user
            // toast.success(t("record_saved"))

            // // tell search page to refresh its list
            tellSearchPageToTriggerSearch()
        })

        window.apeye.send(ipcRequestName, params)
    }
    // // END: methods for item code add/edit dialog

    const getCategoryTitle = (value) => {
        const ccategory = categories.find(qategory => qategory.value === value)
        if (ccategory) {
            return ccategory.title
        }
        return ""
    }

    const setPicture = async (event) => {
        // // Upload as is
        /* const reader = new FileReader()
        reader.readAsDataURL(event.target.files[0])
        reader.onload = () => {
            setImageBlob((oldvalue) => { return reader.result })
        } */

        // // Next one returns "[object File]"
        //console.log('setPicture: 01 event.target.files[0] =', event.target.files[0]);

        // // Resize before upload
        resizeImage({ file: event.target.files[0], maxSize: 200 }).then(
            function (resizedImage) {

                //console.log("setPicture: 02")

                setImageBlob((oldvalue) => {

                    //console.log("setPicture: 03")

                    //return resizedImage.url
                    return resizedImage
                })

                //console.log("setPicture: 04")

            }).catch(function (err) {

                console.error("setPicture: " + err)

            })

        //console.log('setPicture: 05')

    }

    /* const blobToBase64 = async (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result)
                } else {
                    reject('Failed to convert blob to base64')
                }
            };
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    } */

    const handleImageBlobPaste = async (event) => {
        if (!writable) { return }

        try {
            if (!navigator.clipboard) {
                console.error("Clipboard API not available")
                return
            }

            const clipboardItems = await navigator.clipboard.read()
            for (const clipboardItem of clipboardItems) {
                const imageTypes = clipboardItem.types.find(type => type.startsWith('image/'));

                if (imageTypes) {
                    const blob = await clipboardItem.getType(imageTypes)

                    /* // // Works ok, but no resizing
                    const base64String = await blobToBase64(blob)
                    setImageBlob(base64String) */

                    console.log(`blob.type = ${blob.type}`);

                    const fileExt = (blob.type).split("/")[1]
                    const fakeFileName = "whatever." + fileExt

                    // // Convert to image & resize ...
                    const fileFromBlob = new File([blob], fakeFileName, {
                        type: blob.type,
                    });

                    // // Resize before upload
                    resizeImage({ file: fileFromBlob, maxSize: 200 }).then(
                        function (resizedImage) {

                            //console.log("setPicture: 02")

                            setImageBlob((oldvalue) => {

                                //console.log("setPicture: 03")

                                //return resizedImage.url
                                return resizedImage
                            })

                            //console.log("setPicture: 04")

                        }).catch(function (err) {

                            console.error("setPicture: " + err)

                        })

                    break // Assuming we need the first image
                }
            }
        } catch (err) {

            console.error("Failed to read clipboard:", err)

        }
    }

    const onBack = (event) => {
        event.preventDefault()
        router.history.back()
        return false
    }

    return (
<div className="flex h-auto flex-col p-6">
{/* h-full trims the bottom it seems */}

    {/* <div className="p-4 border border-gray-400 border-t-20 border-t-indigo-400 rounded-tl-lg rounded-tr-lg"> */}

        <div className="flex flex-1 flex-row justify-between">
            <div className="text-4xl font-bold cursor-pointer" onClick={ toggleEyed }>
                {writable ? (eyed == -1 ? t("addSample") : t("editSample") ) : t("viewSample") }
            </div>
            <div className="flex flex-row items-center justify-items-end gap-2 ">
                {/* <Link to="/" onClick={onBack}><ArrowLeft /> {t("back")}</Link> */}
                <span className={cn(
                    "text-gray-100",
                    grayIdVisibility ? "visible" : "invisible"
                )}>{eyed}</span>
                {/* Only show the "Back" button when launched by a new process */}
                {!window.apeye.yourl && <Button
                    variant={"outline"}
                    className="w-auto"
                    onClick={onBack}
                ><ArrowLeft /> {t("back")}</Button>}

                {/* Only show the add item code button for existing samples */}
                {(eyed != -1) && writable &&
                    <div className="text-right">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    className="bg-green-600 w-[148px]"
                                    onClick={(e) => {
                                        e.value = -1
                                        editItemCode(e)
                                    }}
                                ><Plus />{t("addItemCode")}</Button>
                            </DialogTrigger>{/* className="sm:max-w-md" */}
                            <DialogContent className="sm:max-w-xl p-6">
                                <DialogHeader>
                                    <DialogTitle>{t('addEditItemCode')}</DialogTitle>
                                    {/* <DialogDescription>
                                        Anyone who has this link will be able to view this.
                                    </DialogDescription> */}
                                </DialogHeader>
                                <div className="w-full grid grid-cols-2 justify-between justify-items-start gap-6">

                                    {/* START : actual fields */}
                                    <div className="col-span-2 flex flex-col gap-2">
                                            <Label>{t("product_name")} <Asterisk className="text-red-300" /></Label>
                                        {/* readOnly */}
                                        <Input
                                            type="text"
                                            id="name"
                                            value={itemCodeName}
                                            onChange={(e) => setItemCodeName(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label>{t("color")}</Label>
                                        <Input
                                            type="text"
                                            id="color_code"
                                            value={itemCodeColorCode}
                                            onChange={(e) => setItemCodeColorCode(e.target.value)}
                                        />
                                    </div>

                                    <div className="relative flex flex-col gap-2 w-full">
                                        <Label>{t("opening_confirmation_date")}</Label>
                                        <Popover modal={true}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "justify-start text-left font-normal",
                                                        !itemCodeConfirmationDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon />
                                                    {/* itemCode.CONFIRMATION_DATE ? format(itemCode.CONFIRMATION_DATE, "yyyy/MM/dd") : <span>{t("opening_confirmation_date")}</span> */}
                                                    {itemCodeConfirmationDate ? format(itemCodeConfirmationDate, "yyyy/MM/dd") : <span>{t("opening_confirmation_date")}</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={itemCodeConfirmationDate}
                                                    onSelect={setItemCodeConfirmationDate}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <div className="absolute right-3 top-4/5 transform -translate-y-4/5">
                                            <CircleX className="text-gray-300 cursor-pointer" size={18} onClick={() => setItemCodeConfirmationDate(null)} />
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex flex-col gap-2 w-full">
                                        <Label>{t("remark")}</Label>
                                        <Textarea
                                            id="remark"
                                            value={itemCodeRemark}
                                            onChange={(e) => setItemCodeRemark(e.target.value)}
                                        />
                                    </div>
                                    {/* END : actual fields */}
                                </div>
                                <DialogFooter className="sm:justify-start">
                                    <DialogClose asChild>
                                        <Button
                                            className="self-end bg-green-600 mr-2"
                                            onClick={(e) => {
                                                e.value = -1
                                                saveItemCode(e)
                                            }}
                                        >{t('save')}</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    </div>
                }

            </div>
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-6 mt-2">

            <div className="flex flex-col w-full gap-2">
                <Label className="text-lg" htmlFor="productNo">{t("productNo")} {writable && <Asterisk className="text-red-300" />}</Label>
                {writable ?
                    <Input
                        type="text"
                        id="productNo"
                        value={productNo}
                        onChange={(e) => setProductNo(e.target.value)}
                    />
                    :
                    <div className="text-gray-600">{ productNo }</div>
                }
            </div>

            {/* <div className="w-full max-w-sm items-center gap-1.5"> */}
            <div className="flex flex-col w-full gap-2">
                <Label className="text-lg" >{t("category")} {writable && <Asterisk className="text-red-300" />}</Label>
            {writable ?
                <Select
                    value={category || ""}
                    onValueChange={(e) => setCategory(e)}>
                    <SelectTrigger className="w-full">
                        {/* <SelectValue placeholder={t("category")} /> */}
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        {/* <SelectLabel>Language</SelectLabel> */}
                        {categories.map((category) =>
                            <SelectItem
                                key={category.value}
                                value={category.value}
                            >{category.title}</SelectItem>
                        )}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                :
                <div className="text-gray-600">{getCategoryTitle(category)}</div>
            }
            </div>



            <div className="flex flex-col w-full gap-2">
                <Label className="text-lg" htmlFor="productNo">{t("unitPrice")}</Label>
                {writable ?
                    <Input
                        type="text"
                        id="unitPrice"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                    />
                    :
                    <div className="text-gray-600">{unitPrice}</div>
                }
            </div>

            <div className="flex flex-col w-full gap-2">
                <Label className="text-lg" htmlFor="drawingNo">{t("drawingNo")}</Label>
                {writable ?
                    <Input
                        type="text"
                        id="drawingNo"
                        value={drawingNo}
                        onChange={(e) => setDrawingNo(e.target.value)}
                    />
                    :
                    <div className="text-gray-600">{drawingNo}</div>
                }
            </div>



            <div className="flex flex-col w-full gap-2">
                <Label className="text-lg" htmlFor="material">{t("material")}</Label>
                {writable ?
                    <Input
                        type="text"
                        id="material"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                    />
                    :
                    <div className="text-gray-600">{material}</div>
                }
            </div>

            <div className="flex flex-col w-full gap-2">
                <Label className="text-lg" htmlFor="dimensionCheck">{t("dimensionCheck")}</Label>
                {writable ?
                    <Input
                        type="text"
                        id="dimensionCheck"
                        value={dimensionCheck}
                        onChange={(e) => setDimensionCheck(e.target.value)}
                    />
                    :
                    <div className="text-gray-600">{dimensionCheck}</div>
                }
            </div>



            <div className="flex flex-col w-full gap-2">
                <Label className="text-lg" >{t("sampleDate")}</Label>
                {writable ?
                    <div className="relative">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !sampleDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {sampleDate ? format(sampleDate, "yyyy/MM/dd") : <span>{t("sampleDate")}</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={sampleDate}
                                    onSelect={(e) => setSampleDate(e)}
                                />{/* onSelect={setSampleDate} */}
                            </PopoverContent>
                        </Popover>
                        <div className="absolute right-3 top-3/5 transform -translate-y-3/5">
                            <CircleX className="text-gray-300 cursor-pointer" size={18} onClick={() => setSampleDate(null)} />
                        </div>
                    </div>
                    :
                    <div className="text-gray-600">{sampleDate ? format(sampleDate, "yyyy/MM/dd") : ""}</div>
                }
            </div>

            <div className="flex flex-col w-full gap-2">
                <Label className="text-lg" >{t("moldReleaseDate")} </Label>
                {writable ?
                    <div className="relative">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !moldReleaseDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {moldReleaseDate ? format(moldReleaseDate, "yyyy/MM/dd") : <span>{t("moldReleaseDate")}</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={moldReleaseDate}
                                    onSelect={(e) => {
                                        //setMoldReleaseDate(e.target.value)
                                        //setMoldReleaseDate(e.value)
                                        setMoldReleaseDate(e)
                                    }}
                                />{/* onSelect={setMoldReleaseDate} */}
                            </PopoverContent>
                        </Popover>
                        <div className="absolute right-3 top-3/5 transform -translate-y-3/5">
                            <CircleX className="text-gray-300 cursor-pointer" size={18} onClick={() => setMoldReleaseDate(null)} />
                        </div>
                    </div>
                    :
                    <div className="text-gray-600">{moldReleaseDate ? format(moldReleaseDate, "yyyy/MM/dd") : ""}</div>
                }
            </div>



            <div className="flex flex-col w-full gap-2">
                <Label className="text-lg" htmlFor="strengthTest">{t("strengthTest")}</Label>
                {writable ?
                    <Input
                        type="text"
                        id="strengthTest"
                        value={strengthTest}
                        onChange={(e) => setStrengthTest(e.target.value)}
                    />
                    :
                    <div className="text-gray-600">{strengthTest}</div>
                }
            </div>

            <div className="flex flex-col w-full gap-2">
                <Label className="text-lg" htmlFor="picture">{t("picture")}</Label>
                {writable &&
                    <div className="flex flex-row w-full gap-2">
                        <Input id="picture" type="file" accept="image" onChange={(e) => setPicture(e)} />
                        <Button onClick={handleImageBlobPaste} >{t("pasteFromClipboard")}</Button>
                    </div>
                }
                {/* self-center */}
                    <div className="w-[200px] h-[200px] bg-gray-200 flex flex-col items-center justify-center ">
                {imageBlob ?
                    <img className="size-fit" src={imageBlob} />
                    :
                    <FileImage className="size-16 text-gray-400" />
                }
                </div>
            </div>

        {writable &&
            <div>
                <Button
                    id="db-save"
                    className="bg-green-600 justify-start text-left font-normal"
                    onClick={saveSample}
                >{t("save")}</Button>
            </div>
        }

        </div>

    {/* </div> */}



    {/* itemCodes.length > 0 && */}
    {eyed != -1 && 

        <>
            <div className="w-full h-px mt-2 mb-2 border border-gray-400"></div>

            <div className="flex flex-row justify-between items-center">
                <div className="font-bold my-4">Item code {t("list")}</div>
            </div>

            {(!writable && pageCount == 0) &&
                <div>{t("noItemCode")}</div>
            }

            {/* item codes pagination */}
            {pageCount > 1 &&
                <Pagination>
                    <PaginationContent>
                        {(page > 1) && <PaginationItem>
                            <PaginationPrevious href="#"
                                label={t("previous")}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setPage((oldValue) => oldValue - 1)
                                    setTriggerSearch((oldValue) => oldValue + 1)
                                    return false
                                }} />
                        </PaginationItem>}
                        {hasLeftElipsis && <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>}
                        {/* Array.from({ length: pageCount }, (_, index) => { */}
                        {visiblePages.map((index) => {
                            const conditionalAttributes = (page == index) ? { isActive: true } : {}
                            return (
                                <PaginationItem key={index} >
                                    <PaginationLink
                                        href="#"
                                        {...conditionalAttributes}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            //setPage(index + 1)
                                            setPage((oldValue) => index)
                                            //search(e)
                                            setTriggerSearch((oldValue) => oldValue + 1)
                                            return false
                                        }}>{index}</PaginationLink>
                                </PaginationItem>
                            )
                        })}
                        {hasRightElipsis && <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>}
                        {(page < pageCount) && <PaginationItem>
                            <PaginationNext href="#"
                                label={t("next")}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setPage((oldValue) => oldValue + 1)
                                    setTriggerSearch((oldValue) => oldValue + 1)
                                    return false
                                }} />
                        </PaginationItem>}
                    </PaginationContent>
                </Pagination>
            }

            <Accordion
                type="multiple"
                className="w-full mt-2"
                value={expandedAccordionItems}
                collapsible >
                {rows.map((itemCode) =>
                    <AccordionItem key={itemCode.ID} value={itemCode.ID} className="last:border-b-1 p-4 mb-6 border border-gray-300">
                        <AccordionHeader>
                            <div className="w-full grid grid-cols-2 justify-between gap-6 p-4">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-lg" >{t("product_name")}</Label>
                                    <div className="text-gray-600">{itemCode.NAME}</div>
                                </div>
                                <div className="self-end text-right" >
                                    <Button
                                        className="bg-green-600 mr-2"
                                        onClick={() => trackClickedAccordionItems(itemCode.ID)}
                                    >{expandedAccordionItems.includes(itemCode.ID) ? t("hide_details") : t("expand_details")}</Button>
                                </div>
                            </div>
                        </AccordionHeader>
                        <AccordionContent>

                            <div className="w-full h-px mt-2 mb-2 border border-gray-700"></div>

                            <div className="w-full grid grid-cols-2 justify-between justify-items-start gap-6 mt-6 p-4">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-lg" >{t("color")}</Label>
                                    <div className="text-gray-600">{itemCode.COLOR_CODE}</div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="text-lg" >{t("opening_confirmation_date")}</Label>
                                    <div className="text-gray-600">{(itemCode.CONFIRMATION_DATE)?.replaceAll("-", "/")}</div>
                                </div>
                                <div className="col-span-2 flex flex-col gap-2">
                                    <Label className="text-lg" >{t("remark")}</Label>
                                    <pre className="text-gray-600">{itemCode.REMARK}</pre>
                                </div>
                                {writable &&
                                    <div className="flex flex-row gap-2">
                                        {/* <Button asChild className="bg-green-600 mr-2">
                                            <Link to="/add-edit-item-code/$id" params={{ id: itemCode.ID }}>{t("edit")}</Link>
                                        </Button> */}

                                        {/* add/edit item code dialog within the accordion */}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline"
                                                    onClick={(e) => {
                                                        e.value = itemCode.ID
                                                        editItemCode(e)
                                                    }}
                                                >{t("edit")}</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-xl p-6">
                                                <DialogHeader>
                                                    <DialogTitle>{t('editItemCode')}</DialogTitle>
                                                    {/* <DialogDescription>
                                                    Anyone who has this link will be able to view this.
                                                </DialogDescription> */}
                                                </DialogHeader>
                                                <div className="w-full grid grid-cols-2 justify-between justify-items-start gap-6">

                                                    {/* START : actual fields */}
                                                    <div className="col-span-2 flex flex-col gap-2">
                                                        <Label>{t("product_name")} <Asterisk className="text-red-300" /></Label>
                                                        {/* 
                                                            readOnly 
                                                            value={itemCode.NAME}
                                                        */}
                                                        <Input
                                                            type="text"
                                                            id="name"
                                                            value={itemCodeName}
                                                            onChange={(e) => setItemCodeName(e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <Label>{t("color")}</Label>
                                                        {/* value={itemCode.COLOR_CODE} */}
                                                        <Input
                                                            type="text"
                                                            id="color_code"
                                                            value={itemCodeColorCode}
                                                            onChange={(e) => setItemCodeColorCode(e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="relative flex flex-col gap-2 w-full">
                                                        <Label>{t("opening_confirmation_date")}</Label>
                                                        <Popover modal={true}>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "justify-start text-left font-normal",
                                                                        !itemCodeConfirmationDate && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    <CalendarIcon />
                                                                    {/* itemCode.CONFIRMATION_DATE ? format(itemCode.CONFIRMATION_DATE, "yyyy/MM/dd") : <span>{t("opening_confirmation_date")}</span> */}
                                                                    {itemCodeConfirmationDate ? format(itemCodeConfirmationDate, "yyyy/MM/dd") : <span>{t("opening_confirmation_date")}</span>}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                                                                {/* selected={itemCode.CONFIRMATION_DATE} */}
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={itemCodeConfirmationDate}
                                                                    onSelect={setItemCodeConfirmationDate}
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <div className="absolute right-3 top-4/5 transform -translate-y-4/5">
                                                            <CircleX className="text-gray-300 cursor-pointer" size={18} onClick={() => setItemCodeConfirmationDate(null)} />
                                                        </div>
                                                    </div>

                                                    <div className="col-span-2 flex flex-col gap-2 w-full">
                                                        <Label>{t("remark")}</Label>
                                                        {/* value={itemCode.REMARK} */}
                                                        <Textarea
                                                            id="remark"
                                                            value={itemCodeRemark}
                                                            onChange={(e) => setItemCodeRemark(e.target.value)}
                                                        />
                                                    </div>
                                                    {/* END : actual fields */}
                                                </div>
                                                <DialogFooter className="sm:justify-start">
                                                    <DialogClose asChild>
                                                        <Button
                                                            className="self-end bg-green-600 mr-2"
                                                            onClick={(e) => {
                                                                e.value = itemCode.ID
                                                                saveItemCode(e)
                                                            }}
                                                        >{t('save')}</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                {/* variant="outline" className="text-orange-500 border-orange-500" */}
                                                <Button
                                                    className="bg-red-600"
                                                    onClick={(e) => {
                                                        //e.value = itemCode.ID
                                                        //deleteItemCode(e)
                                                    }}
                                                >{t("delete")}</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-sm p-6">
                                                <DialogHeader>
                                                    <DialogTitle>{t('deleteItemCode')}</DialogTitle>
                                                    {/* <DialogDescription>
                                                Anyone who has this link will be able to view this.
                                            </DialogDescription> */}
                                                </DialogHeader>
                                                <div className="w-full grid grid-cols-1 justify-items-start gap-6">
                                                    <div>{t('areYouSure')}</div>
                                                </div>
                                                <DialogFooter className="sm:justify-start">
                                                    <DialogClose asChild>
                                                        <Button
                                                            className="bg-red-600"
                                                            onClick={(e) => {
                                                                e.value = itemCode.ID
                                                                deleteItemCode(e)
                                                            }}
                                                        >{t("delete")}</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                }
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>

        </>
    }

    <Toaster richColors position="bottom-center" />

    {/* <Footer /> */}

</div>
    );
}
