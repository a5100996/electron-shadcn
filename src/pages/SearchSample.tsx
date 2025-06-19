import React from "react"
//import Footer from "@/components/template/Footer"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    //addDays,
    format
} from "date-fns"
import {
    ArrowDownWideNarrow,
    ArrowUpNarrowWide,
    CalendarIcon,
    CircleX,
    Plus,
} from "lucide-react"
import { cn } from "@/utils/misc"
import { Calendar } from "@/components/ui/calendar"
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
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionContent,
} from "@/components/ui/accordion"
import { useTranslation } from "react-i18next"
import { setAppLanguage } from "@/helpers/language_helpers"
import Languages from "../localization/langs"
import ItemCodeList from "@/components/ItemCodeList"

export default function SearchSample() {
    const { t } = useTranslation()

    const writable = import.meta.env.VITE_WRITABLE

    // // pagination for search results
    const [page, setPage] = React.useState(1)
    const [pageCount, setPageCount] = React.useState(1)
    const [recordCount, setRecordCount] = React.useState(1)
    const limit = 5
    const [visiblePages, setVisiblePages] = React.useState([])
    const [hasLeftElipsis, setHasLeftElipsis] = React.useState(false)
    const [hasRightElipsis, setHasRightElipsis] = React.useState(false)
    // // Next one is the list of samples from search results
    const [rows, setRows] = React.useState([])
    const [triggerSearch, setTriggerSearch] = React.useState(0)

    // // By default, sort samples by product number , A to Z
    const [orderBy, setOrderBy] = React.useState("PRODUCT_NO")
    const [orderAscDesc, setOrderAscDesc] = React.useState(1)

    const [expandedAccordionItems, setExpandedAccordionItems] = React.useState([])

    //const { ipcRenderer } = window.require('electron')

    const navigate = useNavigate()

    /* const languages = [
        { code: "hans", name: "Chinese Simplified" },
        { code: "hant", name: "Chinese Traditional" },
        { code: "en", name: "English" },
    ] */

    //const currentDate = new Date()

    // // Search fields
    const [category, setCategory] = React.useState('')
    const [productNo, setProductNo] = React.useState('')
    const [drawingNo, setDrawingNo] = React.useState('')
    const [moldOpeningDate, setMoldOpeningDate] = React.useState<DateRange | undefined>({
        //from: new Date(2022, 0, 20),
        //from: addDays(currentDate, -3),
        //from: currentDate,
        from: null,
        //to: addDays(new Date(2022, 0, 20), 20),
        //to: addDays(currentDate, 7),
        to: null,
    })
    //const [massProductionDate, setMassProductionDate] = React.useState<Date>(addDays(currentDate, 14))
    const [massProductionDate, setMassProductionDate] = React.useState<DateRange | undefined>({
        from: null,
        to: null,
    })
    const [productName, setProductName] = React.useState('')
    const [color, setColor] = React.useState('')
    //const [sampleConfirmationDate, setSampleConfirmationDate] = React.useState<Date>(addDays(currentDate, 3))
    const [sampleConfirmationDate, setSampleConfirmationDate] = React.useState<DateRange | undefined>({
        from: null,
        to: null,
    })

    const { i18n } = useTranslation();
    const currentLang = i18n.language;
    function onLanguageChange(value: string) {
        setAppLanguage(value, i18n);
    }

    const [categories, setCategories] = React.useState([])

    const initCategories = async () => {
        /* await ipcRenderer.invoke("getCategories").then((response) => {
            setCategories((old) => { return response })
        }) */
        const ipcResponseName = "categories"
        const ipcRequestName = "getCategories"

        //console.log("initCategories: VVVVVVVVVVVVVVVVVV")

        window.apeye.receive(ipcResponseName, (data) => {

            console.log(`${ipcResponseName} from main process returns an array of length ${data?.length}`)

            setCategories((old) => { return data })
        });

        //console.log("initCategories: AAAAAAAAAAAAAAAAAA")

        window.apeye.send(ipcRequestName, {})
    }

    // // Listen for add page to trigger search
    const initTriggerSearchAfterAddSample = async () => {
        const ipcResponseName = "pleaseTriggerSearch"
        //const ipcRequestName = "tellSearchPageToTriggerSearch"

        console.log("initTriggerSearchAfterAddSample: ==^==^==^==^==^==^==^==")

        window.apeye.receive(ipcResponseName, (data) => {

            console.log(`${ipcResponseName} from main process returns data: ${JSON.stringify(data)}`)

            // // Trigger a new search
            setTriggerSearch((oldValue) => oldValue + 1)
        });

        console.log("initTriggerSearchAfterAddSample: ==^==^==^==^==^==^==^==")

        // // In this case, we don't send any request
        //window.apeye.send(ipcRequestName, {})
    }

    React.useEffect(() => {

        console.log("writable =", writable)

        initCategories()

        console.log("so, was there any activity regarding the categories?")

        initTriggerSearchAfterAddSample()

        /* const handleSaveSampleResult = (event, result) => {

            console.log('result.status = ', result.status)
            console.log('result.item_code = ', result.item_code)
            console.log('handleSaveSampleResult : responses = ', responses)

            const rrr = [...responses, result.item_code]

            console.log('handleSaveSampleResult : rrr = ', rrr)

            setResponses(rrr)
        }


        //ipcRenderer.on('save_sample_result', handleSaveSampleResult)
        ipcRenderer.on('startDbResult', handleDbPingResult)
        ipcRenderer.on('fetchManyResult', handleExecuteScriptResult)

        return () => {
            //ipcRenderer.removeListener('save_sample_result', handleSaveSampleResult)
            ipcRenderer.removeListener('startDbResult', handleDbPingResult)
            ipcRenderer.removeListener('fetchManyResult', handleExecuteScriptResult)
        } */
    }, [])

    // // trigger a search for samples
    React.useEffect(() => {
        search(new CustomEvent("search", {}))
    }, [triggerSearch])

    // // when the samples search results changes, refresh:
    // // 1) the relevant pagination
    // // 2) the array which tracks the clicked accordion items
    React.useEffect(() => {
        buildVisiblePageNumbers()
        setExpandedAccordionItems((oldValue) => [])
    }, [rows])

    /* const handleDbPingResult = (event, result) => {

        console.log('handleDbPingResult: result =', result)

    }

    const handleExecuteScriptResult = (event, rows) => {
        //sendAsync(sql).then((result) => setResponse(result));

        console.log('handleDbPingResult: rows =')

        setRows(
            (prevRows) => {
                // Perform calculations with updatedItems here
                return rows
            })

    } */

    const refreshWithNewOrder = async (event, table_column_name) => {
        // // Neither of these have any immediate impact, but the second one is better
        //setOrderBy(table_column_name)
        setOrderBy((oldValue) => table_column_name)
        setOrderAscDesc((oldValue) => oldValue == 1 ? 0 : 1)

        console.log("refreshWithNewOrder: BEFORE: event.value =", event.value)

        // // Let's "cheat" React a bit
        event.value = table_column_name

        console.log("refreshWithNewOrder: AFTER: event.value =", event.value)

        // do a new search
        search(event)
    }

    const search = async (event) => {
        event.preventDefault()

        //sendAsync(sql).then((result) => setResponse(result));

        console.log("search invoked")

        const conditions :string[] = ["1 = 1"]
        const values: string[] = []

        if (category) {

            console.log('search: category is not empty it seems ...')

            conditions.push("category = ?")
            values.push(category)
        }

        if (productNo) {

            console.log('search: productNo is not empty it seems ...')

            //conditions.push("productNo = ?")

            //conditions.push("product_no = ?")
            //values.push(productNo)

            conditions.push("product_no LIKE ?")
            values.push('%' + productNo + '%')
        }

        if (drawingNo) {

            console.log('search: drawingNo is not empty it seems ...')

            //conditions.push("drawingNo = ?")

            //conditions.push("drawing_no = ?")
            //values.push(drawingNo)

            conditions.push("drawing_no LIKE ?")
            values.push('%' + drawingNo + '%')
        }

        if (moldOpeningDate.to && moldOpeningDate.from) {

            console.log('search: moldOpeningDate is not empty it seems ...')

            const from_formatted = format(moldOpeningDate.from, "yyyy-MM-dd")
            const to_formatted = format(moldOpeningDate.to, "yyyy-MM-dd")

            const null_date_string = "1970-01-01"
            if (from_formatted == null_date_string || to_formatted == null_date_string) {

                console.log('search: moldOpeningDate could be unselected')

            } else {
                //conditions.push("drawingNo = ?")
                conditions.push("sample_date between ? and ? ")

                values.push(
                    //moldOpeningDate.from
                    from_formatted
                )
                values.push(
                    //moldOpeningDate.to
                    to_formatted
                )
            }
        }

        /*
        if (massProductionDate) {

            console.log('search: massProductionDate is not empty it seems ...')

            const mpd_formatted = format(massProductionDate, "yyyy-MM-dd")

            const null_date_string = "1970-01-01"
            if (mpd_formatted == null_date_string) {

                console.log('search: massProductionDate could be unselected')

            } else {
                //conditions.push("mass_production_date = ? ")
                conditions.push("mold_release_date = ? ")

                values.push(
                    //massProductionDate
                    mpd_formatted
                )
            }
        }
        */

        if (massProductionDate.to && massProductionDate.from) {

            console.log('search: massProductionDate is not empty it seems ...')

            const from_formatted = format(massProductionDate.from, "yyyy-MM-dd")
            const to_formatted = format(massProductionDate.to, "yyyy-MM-dd")

            const null_date_string = "1970-01-01"
            if (from_formatted == null_date_string || to_formatted == null_date_string) {

                console.log('search: massProductionDate could be unselected')

            } else {
                //conditions.push("mass_production_date = ?")
                conditions.push("mold_release_date between ? and ? ")

                values.push(
                    //massProductionDate.from
                    from_formatted
                )
                values.push(
                    //massProductionDate.to
                    to_formatted
                )
            }
        }

        // // include item code fields in search query

        let includeItemCodeCondition = false

        if (productName) {

            console.log('search: productName is not empty it seems ...')

            //conditions.push("productName = ?")

            //conditions.push("c.NAME = ?")
            //values.push(productName)

            conditions.push("c.NAME LIKE ?")
            values.push('%' + productName + '%')

            includeItemCodeCondition = true
        }

        if (color) {

            console.log('search: color is not empty it seems ...')

            //conditions.push("color = ?")

            //conditions.push("c.COLOR_CODE = ?")
            //values.push(color)

            conditions.push("c.COLOR_CODE LIKE ?")
            values.push('%' + color + '%')

            includeItemCodeCondition = true
        }

        /*
        if (sampleConfirmationDate) {

            console.log('search: sampleConfirmationDate is not empty it seems ...')

            const scd_formatted = format(sampleConfirmationDate, "yyyy-MM-dd")

            const null_date_string = "1970-01-01"
            if (scd_formatted == null_date_string) {

                console.log('search: sampleConfirmationDate could be unselected')

            } else {
                //conditions.push("sampleConfirmationDate = ? ")
                conditions.push("c.CONFIRMATION_DATE = ? ")

                values.push(
                    //sampleConfirmationDate
                    scd_formatted
                )

                includeItemCodeCondition = true
            }
        }
        */

        if (sampleConfirmationDate.to && sampleConfirmationDate.from) {

            console.log('search: sampleConfirmationDate is not empty it seems ...')

            const from_formatted = format(sampleConfirmationDate.from, "yyyy-MM-dd")
            const to_formatted = format(sampleConfirmationDate.to, "yyyy-MM-dd")

            const null_date_string = "1970-01-01"
            if (from_formatted == null_date_string || to_formatted == null_date_string) {

                console.log('search: sampleConfirmationDate could be unselected')

            } else {
                //conditions.push("sampleConfirmationDate = ?")
                conditions.push("c.CONFIRMATION_DATE between ? and ? ")

                values.push(
                    //sampleConfirmationDate.from
                    from_formatted
                )
                values.push(
                    //sampleConfirmationDate.to
                    to_formatted
                )

                includeItemCodeCondition = true
            }
        }

        let actualOrderBy = orderBy
        // // If this was called from the "Search" button, "value" would be undefined
        if (typeof event.value != "undefined") {
            actualOrderBy = event.value
        }

        let query = "SELECT a.*, b.B_L_O_B AS eemage "
            + "FROM samples a "
            + "LEFT JOIN images b ON a.ID = b.SAMPLE_ID "

        if (includeItemCodeCondition) {
            query += "LEFT JOIN item_codes c ON a.ID = c.SAMPLE_ID "
        }

        query += "WHERE "
            + conditions.join(" AND ")
            + " ORDER BY " + actualOrderBy + (orderAscDesc == 0 ? " DESC " : " ASC ")
            //+ " LIMIT " + limit

        console.log("search: query = ", query)
        console.log('search: conditions = ', conditions)
        console.log('search: values = ', values)

        const pagination = { limit: limit, page: page }

        const params = {
            query: query,
            values: values,
            pagination: pagination
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        const ipcResponseName = "many"
        const ipcRequestName = "fetchMany"

        window.apeye.receive(ipcResponseName, (response) => {
            console.log(`${ipcResponseName} from main process returns :`);
            //console.log(JSON.stringify(data));

            if (response && response.rows) {

                console.log(`response.rows.length = ${response.rows.length}`);

                const p_c = Math.ceil(response.totalResultCount / response.limit)
                setPageCount((oldValue) => p_c)

                setRecordCount((oldValue) => response.totalResultCount)

                setRows((prevRows) => {
                    // Perform calculations with updatedItems here
                    return response.rows
                })

                console.log("search response.rows[0].id =", response.rows[0].id)
                console.log("search response.rows[0].ID =", response.rows[0].ID)
                console.log("search response.limit =", response.limit)
                console.log("search response.page =", response.page)
                console.log("search number of records i.e. response.totalResultCount =", response.totalResultCount)
                console.log("search number of records i.e. recordCount =", recordCount)
                console.log("search number of pages i.e. p_c =", p_c)
                console.log("search number of pages i.e. pageCount =", pageCount)

                //buildVisiblePageNumbers()
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

    // // handler for "Clear all search conditions"
    const clearSearch = async (event) => {
        // // Clear pagination values
        //setPage(0)
        setPage(1)
        setPageCount(0)
        setRecordCount(0)
        //setRows([])
        setRows((oldValue) => { return [] })

        // // Clear search form
        setCategory((oldValue) => "")
        setProductNo((oldValue) => "")
        setDrawingNo((oldValue) => "")
        setMoldOpeningDate((oldValue) => { return { from: null, to: null } })
        setMassProductionDate((oldValue) => { return { from: null, to: null } })

        setProductName((oldValue) => "")
        setColor((oldValue) => "")
        setSampleConfirmationDate((oldValue) => { return { from: null, to: null } })

        // // Trigger a new search
        setTriggerSearch((oldValue) => oldValue + 1)
    }

    const buildVisiblePageNumbers = () => {
        const visiblePageNumberCount = 5
        let hasLeftElipsis = false
        let hasRightElipsis = false

        let visiblePages = []

        if (pageCount > visiblePageNumberCount) {
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

    const trackClickedAccordionItems = (row_id: int) => {

        console.log('trackClickedAccordionItems: expandedAccordionItems = ', expandedAccordionItems)
        console.log('trackClickedAccordionItems: row_id = ', row_id)

        if (expandedAccordionItems.includes(row_id)) {

            console.log('trackClickedAccordionItems: 010')

            const shallow_copy = expandedAccordionItems.filter(ev => ev !== row_id)

            console.log('trackClickedAccordionItems: 020 shallow_copy = ', shallow_copy)

            // // Remove from list of open accordion items
            setExpandedAccordionItems((oldValue) => shallow_copy)

            console.log('trackClickedAccordionItems: 030 expandedAccordionItems = ', expandedAccordionItems)

        } else {

            console.log('trackClickedAccordionItems: 110')

            setExpandedAccordionItems(existingValue => {

                console.log('trackClickedAccordionItems: 120 existingValue =', existingValue)

                return [...existingValue, row_id]
            })

            console.log('trackClickedAccordionItems: 130 expandedAccordionItems = ', expandedAccordionItems)

        }

        return true
    }

    /* // // Is this neccessary given that accordionTriggerClick exists ?
    const checkItemCode = async (event) => {
        // // Prevent the parent AccordionTrigger from getting this event
        event.stopPropagation();

        console.log("TODO: implement checkItemCode? event =", event)

    } */

    const viewSample = async (event) => {
        // // Prevent the parent AccordionTrigger from getting this event
        event.stopPropagation();

        //console.log("TODO: implement viewSample. event =", event)
        console.log("TODO: implement viewSample. event.value =", event.value)

    }

    const editSample = async (event) => {
        // // Prevent the parent AccordionTrigger from getting this event
        event.stopPropagation();

        //console.log("TODO: implement editSample. event =", event)
        console.log("TODO: implement editSample. event.value =", event.value)

    }

    const deleteSample = async (event) => {
        // // Prevent the parent AccordionTrigger from getting this event
        event.stopPropagation();

        console.log(`removing sample with id ${event.value}`)

        const params = event.value

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        const ipcResponseName = "sampleDeleted"
        const ipcRequestName = "deleteSample"

        window.apeye.receive(ipcResponseName, (response) => {
            console.log(`${ipcResponseName} from main process returns :`);
            //console.log(JSON.stringify(data));

            if (response) {

                console.log(`${ipcResponseName} : response = ${response}`)

                /* // // Remove item locally ... but total record stays the same and client does not want that
                setRows(existingValue => {
                    return existingValue.filter(ev => ev.ID !== event.value)
                }) */

                // // Trigger a new search
                setTriggerSearch((oldValue) => oldValue + 1)
            }
        })

        window.apeye.send(ipcRequestName, params)
    }

    return (
        <div className="flex h-auto flex-col p-6">
        {/* h-full trims the bottom it seems */}

            {/* <div className="p-2 border border-gray-400 border-t-20 border-t-indigo-400 rounded-tl-lg rounded-tr-lg"> */}

                <div className="flex flex-1 flex-row justify-between">
                    <h1 className="text-4xl font-bold">{t("sampleManagement")}</h1>
                    {/* grid grid-flow-col grid-rows-3  */}
                    <div className="flex flex-col gap-y-3 justify-items-start">
                        <div>

                            <div>{t("language")}</div>

                            <Select
                                value={currentLang}
                                onValueChange={onLanguageChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {/* <SelectLabel>Language</SelectLabel> */}
                                        {Languages.map((language) =>
                                            <SelectItem key={language.key} value={language.key}>{language.nativeName}</SelectItem>
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                        </div>

                    {/* <Button
                            id="add-sample"
                            className="bg-green-600 w-[128px] mt-2"
                            onClick={() =>
                                navigate({
                                    to: '/add-edit-sample',
                                    search: { page: 2 },
                                })
                            }
                        ><Plus />{t("add_sample")}</Button> */}

                    {(writable == true) &&
                        <div className="text-right">
                            <Button
                                className="bg-green-600 mr-2"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    //const url = "/add-edit-sample""
                                    const url = "/add-edit-sample?language=" + currentLang
                                    window.apeye.send("openNewWindow", url)
                                }}
                            ><Plus />{t("add_sample")}</Button>
                        </div>
                    }

                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 gap-y-4 p-4 mt-2 border border-gray-400 rounded-md">
                    <div className="col-span-full text-lg">{t("search")}</div>

                    {/* <div className="w-full max-w-sm items-center gap-1.5"> */}
                    <div className="relative col-span-1 flex flex-col w-full gap-2">
                        <Label>{t("category")}</Label>
                        <Select value={category || ""} onValueChange={(e) => setCategory(e)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t("category")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {/* <SelectLabel>Language</SelectLabel> */}
                                    {categories.map((category) =>
                                        <SelectItem
                                            key={category.value}
                                            value={category.value} >{category.title}</SelectItem>
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="absolute right-8 top-4/5 transform -translate-y-4/5">
                            <CircleX className="text-gray-300 cursor-pointer" size={18} onClick={() => setCategory("") } />
                        </div>
                    </div>

                    <div className="relative col-span-1 flex flex-col w-full gap-2">
                        <Label htmlFor="productNo">{t("productNo")}</Label>
                        <Input
                            type="text"
                            id="productNo"
                            value={productNo}
                            onChange={(e) => setProductNo(e.target.value)}
                        />
                        <div className="absolute right-3 top-4/5 transform -translate-y-4/5">
                            <CircleX className="text-gray-300 cursor-pointer" size={18} onClick={() => setProductNo("")} />
                        </div>
                    </div>

                    <div className="relative col-span-1 flex flex-col w-full gap-2">
                        <Label htmlFor="drawingNo">{t("drawingNo")}</Label>
                        <Input
                            type="text"
                            id="drawingNo"
                            value={drawingNo}
                            onChange={(e) => setDrawingNo(e.target.value)}
                        />
                        <div className="absolute right-3 top-4/5 transform -translate-y-4/5">
                            <CircleX className="text-gray-300 cursor-pointer" size={18} onClick={() => setDrawingNo("")} />
                        </div>
                    </div>

                    <div className="relative col-span-1 flex flex-col gap-2">
                        <Label>{t("moldOpeningDate")}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !moldOpeningDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {moldOpeningDate?.from ? (
                                        moldOpeningDate.to ? (
                                            <>
                                                {format(moldOpeningDate.from, "LLL dd, y")} -{" "}
                                                {format(moldOpeningDate.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(moldOpeningDate.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>{t("pickDate")}</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    numberOfMonths={2}
                                    defaultMonth={moldOpeningDate?.from}
                                    selected={moldOpeningDate}
                                    onSelect={setMoldOpeningDate}
                                />
                            </PopoverContent>
                        </Popover>
                        {/* <div className="relative -right-62 transform -translate-y-9"> */}
                        <div className="absolute right-3 top-4/5 transform -translate-y-4/5">
                            <CircleX className="text-gray-300 cursor-pointer" size={18} onClick={() => setMoldOpeningDate({ from: null, to: null })} />
                        </div>
                    </div>

                    <div className="col-span-1 w-full">&nbsp;</div>

                    <div className="relative col-span-1 flex flex-col gap-2">
                        <Label>{t("massProductionDate")}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !massProductionDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {/* massProductionDate ? format(massProductionDate, "PPP") : <span>{t("pickDate")}</span> */}
                                    {massProductionDate?.from ? (
                                        massProductionDate.to ? (
                                            <>
                                            {format(massProductionDate.from, "LLL dd, y")} -{" "}
                                            {format(massProductionDate.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(massProductionDate.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>{t("pickDate")}</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="range"
                                    numberOfMonths={2}
                                    defaultMonth={massProductionDate?.from}
                                    selected={massProductionDate}
                                    onSelect={setMassProductionDate}
                                />
                            </PopoverContent>
                        </Popover>
                        {/* <div className="relative -right-62 transform -translate-y-9"> */}
                        <div className="absolute right-3 top-4/5 transform -translate-y-4/5">
                            <CircleX className="text-gray-300 cursor-pointer" size={18} onClick={() => setMassProductionDate({ from: null, to: null })} />
                        </div>
                    </div>

                    {/* START : item code search row */}

                    <div className="relative col-span-1 flex flex-col w-full gap-2">
                        <Label htmlFor="productName">{t("product_name")}</Label>
                        <Input
                            type="text"
                            id="productName"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                        <div className="absolute right-3 top-4/5 transform -translate-y-4/5">
                            <CircleX className="text-gray-300 cursor-pointer" size={18} onClick={() => setProductName("")} />
                        </div>
                    </div>

                    <div className="relative col-span-1 flex flex-col w-full gap-2">
                        <Label htmlFor="color">{t("color")}</Label>
                        <Input
                            type="text"
                            id="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                        <div className="absolute right-3 top-4/5 transform -translate-y-4/5">
                            <CircleX className="text-gray-300 cursor-pointer" size={18} onClick={() => setColor("")} />
                        </div>
                    </div>

                    <div className="relative col-span-1 flex flex-col gap-2">
                        <Label htmlFor="sampleConfirmationDate">{t("sampleConfirmationDate")}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !sampleConfirmationDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {sampleConfirmationDate?.from ? (
                                        sampleConfirmationDate.to ? (
                                            <>
                                            {format(sampleConfirmationDate.from, "LLL dd, y")} -{" "}
                                            {format(sampleConfirmationDate.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(sampleConfirmationDate.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>{t("pickDate")}</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="range"
                                    numberOfMonths={2}
                                    defaultMonth={sampleConfirmationDate?.from}
                                    selected={sampleConfirmationDate}
                                    onSelect={setSampleConfirmationDate}
                                />
                            </PopoverContent>
                        </Popover>
                        {/* <div className="absolute -right-62 transform -translate-y-9"> */}
                        <div className="absolute right-3 top-4/5 transform -translate-y-4/5">
                            <CircleX className="text-gray-300 cursor-pointer" size={18} onClick={() => setSampleConfirmationDate({ from: null, to: null })} />
                        </div>
                    </div>

                    {/* END : item code search row */}

                    <div className="col-span-full">
                        <div className="flex flex-rows justify-end w-full gap-2">
                            <Button
                                id="search"
                                className="bg-blue-600"
                                onClick={(e) => {
                                    setPage(1)
                                    search(e)
                                }}
                            >{t("search")}</Button>
                            <Button
                                id="clear-search"
                                variant="outline"
                                className="text-orange-500 border-orange-500"
                                onClick={clearSearch}
                            >{t("clearAllSearchConditions")}</Button>
                        </div>
                    </div>


                </div>

                {/* </div> */}

            {/* <pre>
        {(rows && JSON.stringify(rows, null, 2)) ||
            'No query results yet!'}
    </pre> */}

            <div className="flex flex-row justify-start gap-x-8 p-2 mt-4 mb-2">
                <div>{page}/{pageCount} {t("page")}</div><div>{t("total_n_records", { record_count: recordCount })}</div>
            </div>

            <div className="w-full grid grid-cols-9 justify-between justify-items-start gap-2 p-4 mb-2 border border-gray-400 rounded-sm text-sm">
                <div className="col-span-1">{t("picture")}</div>
                <div
                    className={cn(
                        "col-span-2 cursor-pointer flex flex-row",
                        (orderBy == "PRODUCT_NO") && "text-blue-700 font-bold"
                    )}
                    onClick={(e) => refreshWithNewOrder(e, "PRODUCT_NO")}>
                    {(orderBy == "PRODUCT_NO") ? (orderAscDesc ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />) : "" }
                    {t("productNo")}
                </div>
                <div
                    className={cn(
                        "col-span-2 cursor-pointer flex flex-row",
                        (orderBy == "DRAWING_NO") && "text-blue-700 font-bold"
                    )}
                    onClick={(e) => refreshWithNewOrder(e, "DRAWING_NO")}>
                    {(orderBy == "DRAWING_NO") ? (orderAscDesc ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />) : ""}
                    {t("drawingNo")}
                </div>
                <div
                    className={cn(
                        "col-span-1 cursor-pointer justify-self-end flex flex-row",
                        (orderBy == "UNIT_PRICE") && "text-blue-700 font-bold"
                    )}
                    onClick={(e) => refreshWithNewOrder(e, "UNIT_PRICE")}>
                    {(orderBy == "UNIT_PRICE") ? (orderAscDesc ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />) : ""}
                    {t("unitPrice")}</div>
                <div
                    className={cn(
                        "col-span-1 cursor-pointer justify-self-end flex flex-row pr-3",
                        (orderBy == "MATERIAL") && "text-blue-700 font-bold"
                    )}
                    onClick={(e) => refreshWithNewOrder(e, "MATERIAL")}>
                    {(orderBy == "MATERIAL") ? (orderAscDesc ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />) : ""}
                    {t("material")}</div>
                <div
                    className={cn(
                        "col-span-1 cursor-pointer justify-self-end flex flex-row",
                        (orderBy == "SAMPLE_DATE") && "text-blue-700 font-bold"
                    )}
                    onClick={(e) => refreshWithNewOrder(e, "SAMPLE_DATE")}>
                    {(orderBy == "SAMPLE_DATE") ? (orderAscDesc ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />) : ""}
                    <div className="w-[7rem]">
                        {t("moldOpeningDate")}
                    </div></div>
                <div
                    className={cn(
                        "col-span-1 cursor-pointer justify-self-end flex flex-row",
                        (orderBy == "MOLD_RELEASE_DATE") && "text-blue-700 font-bold"
                    )}
                    onClick={(e) => refreshWithNewOrder(e, "MOLD_RELEASE_DATE")}>
                    {(orderBy == "MOLD_RELEASE_DATE") ? (orderAscDesc ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />) : ""}
                    <div className="w-[7rem]">
                        {t("massProductionDate")}
                    </div></div>
            </div>

            {/* onValueChange={fetchItemCodes} */}
            <Accordion
                type="multiple"
                className="w-full mb-4"
                value={expandedAccordionItems}
                collapsible >
                {rows.map((row) =>
                    <AccordionItem key={row.ID} value={row.ID} className="p-4 mb-6 last:mb-0 border-0 bg-gray-200 dark:bg-gray-800">
                        <AccordionHeader>
                            <div className="w-full grid grid-cols-9 justify-between justify-items-start gap-2">
                                <div className="col-span-1">
                                    <img className="h-[64px]" src={row.eemage} />
                                </div>
                                <div className="col-span-2">{row.PRODUCT_NO} </div>
                                <div className="col-span-2">{row.DRAWING_NO} </div>
                                <div className="col-span-1 justify-self-end">{row.UNIT_PRICE} </div>
                                <div className="col-span-1 justify-self-end">{row.MATERIAL} </div>
                                <div className="col-span-1 justify-self-end">{(row.SAMPLE_DATE).replaceAll("-", "/")} </div>
                                <div className="col-span-1 justify-self-end">{(row.MOLD_RELEASE_DATE).replaceAll("-", "/")} </div>
                                <div className="col-span-5">
                                    <Button
                                        data-slot="accordion-trigger"
                                        className="w-[148px] bg-blue-600 mr-2"
                                        onClick={() => trackClickedAccordionItems(row.ID)}
                                    >{expandedAccordionItems.includes(row.ID) ? t("hide") : t("check")} item code</Button>

                                    {/* <Button asChild
                                    className="bg-green-600 mr-2">
                                    <Link
                                        to="/view-sample/$id"
                                        params={{ id: row.ID }}
                                        target="_blank" >{t("view")}</Link>
                                </Button> */}

                                    <Button
                                        className="bg-green-600 mr-2"
                                        onClick={(e) => {
                                            //e.preventDefault()
                                            e.stopPropagation()

                                            //e.value = row.ID
                                            //viewSample(e)

                                            //const url = "/view-sample/" + row.ID
                                            const url = "/view-sample/" + row.ID + "?language=" + currentLang

                                            // // Open new window. The window containsa broken application however :(
                                            //window.open(url)

                                            //navigate({ to: url })

                                            window.apeye.send("openNewWindow", url)
                                        }}
                                    >{t("view")}</Button>

                                    {/* <Button asChild
                                    className="bg-green-600 mr-2">
                                        <Link
                                            to="/add-edit-sample/$id"
                                            params={{ id: row.ID }}
                                        >{t("edit")}</Link>
                                </Button> */}

                                    {(writable == true) &&
                                        <Button
                                            className="bg-green-600 mr-2"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                //const url = "/add-edit-sample/" + row.ID
                                                const url = "/add-edit-sample/" + row.ID + "?language=" + currentLang
                                                window.apeye.send("openNewWindow", url)
                                            }}
                                        >{t("edit")}</Button>
                                    }

                                    {/* <Button
                                variant="outline"
                                className="text-orange-500 border-orange-500"
                                onClick={(e) => {
                                    e.value = row.ID
                                    deleteSample(e)
                                }}
                            >{t("delete")}</Button> */}

                                    {(writable == true) &&
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className="bg-red-600"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
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
                                                                e.value = row.ID
                                                                deleteSample(e)
                                                            }}
                                                        >{t("delete")}</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    }
                                </div>
                            </div>
                        </AccordionHeader>
                        <AccordionContent className="pb-0">

                            <ItemCodeList itemCode={row.ID} />

                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>

    {(pageCount == 0) &&
        <div>{t("noSample")}</div>
    }

    {/* samples pagination */}
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
                        <PaginationItem key={index}>
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

    {/* <Footer /> */}

</div>
  );
}
