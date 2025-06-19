import React from "react"
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
import { useTranslation } from "react-i18next"

export default function ItemCodeList({itemCode}) {
    const { t } = useTranslation()

    // // pagination for item codes within accordions
    const [icPage, setIcPage] = React.useState(1)
    const [icPageCount, setIcPageCount] = React.useState(1)
    const [icRecordCount, setIcRecordCount] = React.useState(1)
    const icLimit = 5
    const [icVisiblePages, setIcVisiblePages] = React.useState([])
    const [icHasLeftElipsis, setIcHasLeftElipsis] = React.useState(false)
    const [icHasRightElipsis, setIcHasRightElipsis] = React.useState(false)
    //const [itemCode, setItemCode] = React.useState(-1)
    const [itemCodes, setItemCodes] = React.useState([])
    const [icTriggerSearch, setIcTriggerSearch] = React.useState(0)

    React.useEffect(() => {
        //fetchItemCodes()
        setIcTriggerSearch((oldValue) => oldValue + 1)
    }, [])

    React.useEffect(() => {
        buildIcVisiblePageNumbers()
    }, [itemCodes])

    // // trigger a search for item codes
    React.useEffect(() => {
        fetchItemCodes()
    }, [icTriggerSearch])

    const buildIcVisiblePageNumbers = () => {
        const icVisiblePageNumberCount = 5
        let hasLeftElipsis = false
        let hasRightElipsis = false

        let visiblePages = []

        //console.log("buildIcVisiblePageNumbers: icPageCount vs icVisiblePageNumberCount : ", icPageCount, " vs ", icVisiblePageNumberCount)

        if (icPageCount > icVisiblePageNumberCount) {

            console.log("buildIcVisiblePageNumbers: icPageCount > icVisiblePageNumberCount : ", icPageCount, " > ", icVisiblePageNumberCount)

            let pagePrev = icPage - 1
            let pageNext = icPage + 1
            let pages = [icPage]

            console.log("buildIcVisiblePageNumbers: pagePrev, pageNext, pages: ", pagePrev, ", ", pageNext, ", ", pages)

            do {
                if (pagePrev > 0) {
                    pages.push(pagePrev)
                    pagePrev--
                }

                //if (pageNext < icPageCount) {
                if (pageNext <= icPageCount) {
                    pages.push(pageNext)
                    pageNext++
                }

                console.log("buildIcVisiblePageNumbers: pages: ", pages)

            } while (pages.length < icVisiblePageNumberCount)

            //console.log("buildIcVisiblePageNumbers : 02")

            //pages = pages.sort()
            pages.sort((a, b) => a - b)

            console.log("buildIcVisiblePageNumbers : 03 pages =", pages)
            //console.log("buildIcVisiblePageNumbers : 03 pages[0] =", pages[0])
            //console.log("buildIcVisiblePageNumbers : 03 pages[pages.length - 1] =", pages[pages.length - 1])

            // // Should there be a left elipsis ?
            if (pages[0] != 1)
                hasLeftElipsis = true

            // // Should there be a right elipsis ?
            if (pages[pages.length - 1] != icPageCount)
                hasRightElipsis = true

            visiblePages = pages

            //console.log("buildIcVisiblePageNumbers : 05")

        } else {

            //console.log("buildIcVisiblePageNumbers: icPageCount < icVisiblePageNumberCount : ", icPageCount, " < ", icVisiblePageNumberCount)

            visiblePages = Array.from(
                { length: icPageCount },
                (_, i) => 1 + i)

            //console.log("buildIcVisiblePageNumbers : 07")

        }

        setIcVisiblePages((oldValue) => visiblePages)
        setIcHasLeftElipsis((oldValue) => hasLeftElipsis)
        setIcHasRightElipsis((oldValue) => hasRightElipsis)
    }

    // // handler for AccordionTrigger clicks.
    // // FYI, event = AccordionItem@value
    const fetchItemCodes = async () => {
        const query = "SELECT * FROM item_codes WHERE SAMPLE_ID = ?"

        const values = [itemCode]

        const pagination = { limit: icLimit, page: icPage }

        const params = {
            query: query,
            values: values,
            pagination: pagination
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        // // This pair has already been used earlier.
        // // To provide potential criss crossing of events, use a new one.
        //const ipcResponseName = "many"
        //const ipcRequestName = "fetchMany"
        const ipcResponseName = "many_2"
        const ipcRequestName = "fetchMany_2"

        window.apeye.receive(ipcResponseName, (response) => {
            if (response && response.rows) {

                const p_c = Math.ceil(response.totalResultCount / response.limit)
                setIcPageCount((oldValue) => p_c)

                setIcRecordCount((oldValue) => response.totalResultCount)

                setItemCodes((prevRows) => {
                    // Perform calculations with updatedItems here
                    return response.rows
                })

                //buildIcVisiblePageNumbers()
            } else {
                // // Clear item codes pagination values
                setIcPage(0)
                setIcPageCount(0)
                setIcRecordCount(0)
                setItemCodes([])
            }
        })

        window.apeye.send(ipcRequestName, params)
    }

    return (
<>
    <div className="w-full h-px mt-2 mb-2 border border-gray-700"></div>

    {
        (icPageCount == 0) &&
        <div>{t("noItemCode")}</div>
    }

    {/* item codes pagination */ }
    {
        icPageCount > 1 &&
        <Pagination>
            <PaginationContent className="mt-2">
                {(icPage > 1) && <PaginationItem>
                    <PaginationPrevious href="#"
                        label={t("previous")}
                        onClick={(e) => {
                            e.preventDefault()
                            setIcPage((oldValue) => oldValue - 1)
                            setIcTriggerSearch((oldValue) => oldValue + 1)
                            return false
                        }} />
                </PaginationItem>}
                {icHasLeftElipsis && <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>}
                {/* Array.from({ length: icPageCount }, (_, index) => { */}
                {icVisiblePages.map((index) => {
                    const conditionalAttributes = (icPage == index) ? { isActive: true } : {}
                    return (
                        <PaginationItem key={index}>
                            <PaginationLink
                                href="#"
                                {...conditionalAttributes}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setIcPage((oldValue) => index)
                                    setIcTriggerSearch((oldValue) => oldValue + 1)
                                    return false
                                }}>{index}</PaginationLink>
                        </PaginationItem>
                    )
                })}
                {icHasRightElipsis && <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>}
                {(icPage < icPageCount) && <PaginationItem>
                    <PaginationNext href="#"
                        label={t("next")}
                        onClick={(e) => {
                            e.preventDefault()
                            setIcPage((oldValue) => oldValue + 1)
                            setIcTriggerSearch((oldValue) => oldValue + 1)
                            return false
                        }} />
                </PaginationItem>}
            </PaginationContent>
        </Pagination>
    }

    {itemCodes.map((itemCode) => {
        return (
            <div key={itemCode.ID} className="w-full grid grid-cols-3 justify-between justify-items-start gap-6 mt-6 p-4 border border-gray-400">
                <div className="flex flex-col gap-2">
                    <Label>{t("product_name")}</Label>
                    <div>{itemCode.NAME}</div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>{t("color")}</Label>
                    <div>{itemCode.COLOR_CODE}</div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>{t("opening_confirmation_date")}</Label>
                    <div>{(itemCode.CONFIRMATION_DATE).replaceAll("-", "/")}</div>
                </div>
                <div className="col-span-3 flex flex-col gap-2">
                    <Label>{t("remark")}</Label>
                    <pre>{itemCode.REMARK}</pre>
                </div>
            </div>
        )
    })}

</>
    )
}

//export default ItemCodeList
