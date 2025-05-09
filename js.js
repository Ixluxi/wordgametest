let draggedElement = null
let clone = null
let isDragging = false
let x
let y

$(document).ready(() => {
    // start dragging
    $(document).on('mousedown touchstart', '.draggable', (event) => {
        isDragging = true
        draggedElement = $(event.target)
        clone = draggedElement.clone().addClass('clone').appendTo('body')
        const elementUnderPointer = getElementUnderPointer(event)
        const draggingFromRack = $(elementUnderPointer).parents('#rack').length
        const draggingFromBoard = $(elementUnderPointer).parents('#board').length

        if (draggingFromRack) {
            draggedElement.replaceWith('<div id="rack_target"></div>')
        }

        if (draggingFromBoard) {
            $(elementUnderPointer).removeClass()
        }

        moveClone(event)
    })

    // drag
    $(document).on('mousemove touchmove', (event) => {
        if (isDragging) {
            moveClone(event)
        }
    })

    // drop
    $(document).on('mouseup touchend', (event) => {
        if (isDragging) {
            const elementUnderPointer = getElementUnderPointer(event)
            const droppingOnBoard = $(elementUnderPointer).parent().is('#board') && $(elementUnderPointer).hasClass('droppable')

            if (droppingOnBoard) {
                clone.removeClass().removeAttr('style')
                $(elementUnderPointer).html(clone)
                $(elementUnderPointer).removeClass().addClass('highlight_board_square_flashing')
                $('#rack_target').remove()
            } else {
                clone.removeClass('clone').removeAttr('style')
                $('#rack_target').replaceWith(clone)
            }

            isDragging = false
        }
    })

    $(document).on('dblclick', '.highlight_board_square_flashing', function () {
        returnTilesToRack($(this))
    })
})

function moveClone(event) {
    setPointerCoordinates(event)

    if (x != null && y != null) {
        $(clone).css({ left: x, top: y, position: 'absolute' })

        $('#board > div').removeClass('highlight_board_square_hover')

        const elementUnderPointer = getElementUnderPointer(event)

        if (elementUnderPointer) {
            if ($(elementUnderPointer).parent().is('#board') && $(elementUnderPointer).hasClass('droppable')) {
                $(elementUnderPointer).addClass('highlight_board_square_hover')
            }

            if ($(elementUnderPointer).parent().is('#rack') && $('#rack img').length > 1) {
                const elementWidth = $(elementUnderPointer).outerWidth()
                const pointerOffset = x - $(elementUnderPointer).offset().left
                pointerOffset < elementWidth / 2 ? $('#rack_target').insertBefore($(elementUnderPointer)) : $('#rack_target').insertAfter($(elementUnderPointer))
            }
        }
    }
}

function getElementUnderPointer(event) {
    setPointerCoordinates(event)

    if (Number.isFinite(x) && Number.isFinite(y)) {
        return document.elementFromPoint(x - window.scrollX, y - window.scrollY)
    }

    return null
}

function returnTilesToRack(element = null, returnAllTiles = false) {
    if (!returnAllTiles) {
        element.removeClass().addClass('droppable')
        element.find('img').addClass('draggable').prependTo('#rack')
    } else {
        $('.highlight_board_square_flashing').each(function (index, element) {
            $(element).removeClass().addClass('droppable')
            $(element).find('img').addClass('draggable').prependTo('#rack')
        })
    }
}

function setPointerCoordinates(event) {
    if (event.type.startsWith('touch')) {
        const touches = event.originalEvent?.touches?.[0] || event.originalEvent?.changedTouches?.[0]
        x = touches?.pageX ?? null
        y = touches?.pageY ?? null
    } else {
        x = event.pageX
        y = event.pageY
    }
}